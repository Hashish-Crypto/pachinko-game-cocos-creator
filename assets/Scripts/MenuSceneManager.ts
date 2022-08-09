import { _decorator, Component, Node, Button, director, find, Label } from 'cc'
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

  private _persistentNode: PersistentNode | null = null

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)

    this._setCash(this._persistentNode.cash)

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
}
