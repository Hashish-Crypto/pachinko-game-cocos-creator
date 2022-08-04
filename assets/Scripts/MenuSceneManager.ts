import { _decorator, Component, Node, Button, director } from 'cc'

const { ccclass, property } = _decorator

@ccclass('MenuSceneManager')
export class MenuSceneManager extends Component {
  @property({ type: Node })
  private newGameButton: Node | null = null

  @property({ type: Node })
  private loadingLabel: Node | null = null

  onLoad() {
    this.newGameButton.on(Button.EventType.CLICK, this._newGame, this)
  }

  private _newGame() {
    this.newGameButton.getComponent(Button).interactable = false
    this.loadingLabel.active = true
    director.loadScene('Main')
  }
}
