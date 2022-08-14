import exactMath from 'exact-math'
import { _decorator, Component, Node, Button, director, find, Label, ToggleComponent, EditBoxComponent } from 'cc'
import { PersistentNode } from './PersistentNode'

const { ccclass, property } = _decorator

@ccclass('MenuSceneManager')
export class MenuSceneManager extends Component {
  @property({ type: Label })
  public balanceLabel: Label | null = null

  @property(EditBoxComponent)
  public betEditBox: EditBoxComponent | null = null

  @property([ToggleComponent])
  private betToggles: ToggleComponent[] = []

  @property({ type: Label })
  public hitLabel: Label | null = null

  @property({ type: Label })
  public prizeLabel: Label | null = null

  @property({ type: Node })
  private newGameButton: Node | null = null

  @property({ type: Node })
  private loadingLabel: Node | null = null

  private _persistentNode: PersistentNode | null = null

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)

    this._persistentNode.throwRounds = this._persistentNode.throwRoundsMax
    this._setBalance(this._persistentNode.balance)
    this._setBet(0)

    this.betToggles.forEach((betToggle) => {
      if (betToggle.isChecked) {
        betToggle.interactable = false

        if (betToggle.node.name === 'Toggle1') {
          this._persistentNode.betTarget = 0.25
          this._persistentNode.betMultiplier = 1.75
        } else if (betToggle.node.name === 'Toggle2') {
          this._persistentNode.betTarget = 0.5
          this._persistentNode.betMultiplier = 1.5
        } else if (betToggle.node.name === 'Toggle3') {
          this._persistentNode.betTarget = 2
          this._persistentNode.betMultiplier = 2
        } else if (betToggle.node.name === 'Toggle4') {
          this._persistentNode.betTarget = 3
          this._persistentNode.betMultiplier = 3
        }
      }
    })

    this._setBet(this._persistentNode.bet)
    this._setHit(0)
    this._setPrize(0)

    this.betEditBox.node.on(EditBoxComponent.EventType.TEXT_CHANGED, this._handleBetChange, this)
    this.betToggles.forEach((betToggle) => {
      betToggle.node.on(ToggleComponent.EventType.CLICK, this._setBetTarget, this)
    })
    this.newGameButton.on(Button.EventType.CLICK, this._newGame, this)
  }

  private _setBalance(value: number) {
    this._persistentNode.balance = exactMath.floor(value, -2)
    this.balanceLabel.string = 'HC$' + this._persistentNode.balance.toFixed(2)
  }

  private _setBet(value: number) {
    this._persistentNode.bet = exactMath.floor(value, -2)
  }

  private _setHit(value: number) {
    this._persistentNode.hit = exactMath.floor(exactMath.mul(value, this._persistentNode.betTarget), -2)

    if (this._persistentNode.betTarget < 1) {
      this.hitLabel.string = 'Value to hit less than: HC$' + this._persistentNode.hit.toFixed(2)
    } else if (this._persistentNode.betTarget > 1) {
      this.hitLabel.string = 'Value to hit more than: HC$' + this._persistentNode.hit.toFixed(2)
    }
  }

  private _setPrize(value: number) {
    this._persistentNode.prize = exactMath.floor(
      exactMath.sub(exactMath.mul(value, this._persistentNode.betMultiplier), value),
      -2
    )
    this.prizeLabel.string = 'Prize: HC$' + this._persistentNode.prize.toFixed(2)
  }

  private _setBetTarget(betToggle: ToggleComponent) {
    if (betToggle.isChecked) return

    if (betToggle.node.name === 'Toggle1') {
      betToggle.interactable = false
      this._persistentNode.betTarget = 0.25
      this._persistentNode.betMultiplier = 1.75
    } else if (betToggle.node.name === 'Toggle2') {
      betToggle.interactable = false
      this._persistentNode.betTarget = 0.5
      this._persistentNode.betMultiplier = 1.5
    } else if (betToggle.node.name === 'Toggle3') {
      betToggle.interactable = false
      this._persistentNode.betTarget = 2
      this._persistentNode.betMultiplier = 2
    } else if (betToggle.node.name === 'Toggle4') {
      betToggle.interactable = false
      this._persistentNode.betTarget = 3
      this._persistentNode.betMultiplier = 3
    }

    const otherBetToggles = this.betToggles.filter((toggle) => toggle.node.name !== betToggle.node.name)
    otherBetToggles.forEach((toggle) => {
      toggle.isChecked = false
      toggle.interactable = true
    })

    this._setBet(this._persistentNode.bet)
    this._setHit(this._persistentNode.bet)
    this._setPrize(this._persistentNode.bet)
  }

  private _handleBetChange(editBox: EditBoxComponent) {
    this._setBet(Number(editBox.string))
    this._setHit(this._persistentNode.bet)
    this._setPrize(this._persistentNode.bet)
  }

  private _newGame() {
    if (this._persistentNode.bet <= 0 || exactMath.sub(this._persistentNode.balance, this._persistentNode.bet) < 0)
      return

    this.newGameButton.getComponent(Button).interactable = false
    this.loadingLabel.active = true
    director.loadScene('Main')
  }
}
