import { _decorator, Component, game } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public cash: number = 100
  public bet: number = 0
  public hit: number = 0
  public prize: number = 0
  public throwRoundsMax: number = 5
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
