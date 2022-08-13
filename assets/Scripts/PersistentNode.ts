import { _decorator, Component, game } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public cash: number = 100
  public pot: number = 0
  public throwRoundsMax: number = 2
  public throwRounds: number | null = null
  public betMultiplier: number | null = null
  public betTarget: number | null = null

  onLoad() {
    game.addPersistRootNode(this.node)

    this.resetThrowRounds()
  }

  resetThrowRounds() {
    this.throwRounds = this.throwRoundsMax
  }
}
