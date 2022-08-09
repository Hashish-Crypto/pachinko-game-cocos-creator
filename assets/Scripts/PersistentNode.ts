import { _decorator, Component, game } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public cash: number = 100
  public throwRoundsMax: number = 6
  public throwRounds: number | null = null

  onLoad() {
    game.addPersistRootNode(this.node)

    this.resetThrowRounds()
  }

  resetThrowRounds() {
    this.throwRounds = this.throwRoundsMax
  }
}
