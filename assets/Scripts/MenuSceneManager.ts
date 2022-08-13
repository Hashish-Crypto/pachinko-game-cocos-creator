import { _decorator, Component, Node, Button, director, find, Label, ToggleComponent } from 'cc'
import { PersistentNode } from './PersistentNode'

const { ccclass, property } = _decorator

@ccclass('MenuSceneManager')
export class MenuSceneManager extends Component {
  @property({ type: Label })
  public cashLabel: Label | null = null

  @property({ type: Node })
  private newGameButton: Node | null = null

  @property({ type: Node })
  private loadingLabel: Node | null = null

  @property([ToggleComponent])
  private betToggles: ToggleComponent[] = []

  private _persistentNode: PersistentNode | null = null

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)

    this._setCash(this._persistentNode.cash)

    this.betToggles.forEach((betToggle) => {
      if (betToggle.isChecked) {
        betToggle.interactable = false

        if (betToggle.node.name === 'Toggle1') {
          this._persistentNode.betTarget = 0.75
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

    this.betToggles.forEach((betToggle) => {
      betToggle.node.on(ToggleComponent.EventType.CLICK, this._setBetTarget, this)
    })
    this.newGameButton.on(Button.EventType.CLICK, this._newGame, this)
  }

  private _newGame() {
    this.newGameButton.getComponent(Button).interactable = false
    this.loadingLabel.active = true
    director.loadScene('Main')
  }

  private _setCash(value: number) {
    this._persistentNode.cash = value
    this.cashLabel.string = 'HC$ ' + this._persistentNode.cash.toFixed(2)
  }

  private _setBetTarget(betToggle: ToggleComponent) {
    if (betToggle.isChecked) return

    if (betToggle.node.name === 'Toggle1') {
      betToggle.interactable = false
      this._persistentNode.betTarget = 0.75
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

    console.log(otherBetToggles)
    console.log(betToggle.node.name)
    console.log(this._persistentNode.betTarget)
    console.log(this._persistentNode.betMultiplier)
  }
}
