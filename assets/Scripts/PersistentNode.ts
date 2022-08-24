import { _decorator, Component, game } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public balance: number = 100
  public bet: number | null = null
  public hit: number | null = null
  public prize: number | null = null
  public betMultiplier: number | null = null
  public betTarget: number | null = null
  public throwRoundsMax: number = 6
  public throwRounds: number | null = null

  onLoad() {
    game.addPersistRootNode(this.node)

    this.throwRounds = this.throwRoundsMax
  }
}
