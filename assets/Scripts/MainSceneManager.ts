import {
  _decorator,
  Component,
  Node,
  Collider2D,
  PhysicsSystem2D,
  Contact2DType,
  instantiate,
  Prefab,
  // UITransform,
} from 'cc'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Prefab })
  private pinPrefab: Prefab | null = null

  @property({ type: Node })
  private canvasNode: Node | null = null

  @property({ type: Node })
  private pinRef: Node | null = null

  @property({ type: Node })
  private ballNode: Node | null = null

  private _pinGrid: Node[][] = []
  private _pinGridHeight: number = 7
  private _pinGridWidth: number = 16

  onLoad() {
    // const canvasHeight = this.canvasNode.getComponent(UITransform).contentSize.height
    // const canvasWidth = this.canvasNode.getComponent(UITransform).contentSize.width

    for (let y = 0; y < this._pinGridHeight; y += 1) {
      this._pinGrid[y] = []

      for (let x = 0; x < this._pinGridWidth; x += 1) {
        this._pinGrid[y][x] = instantiate(this.pinPrefab)
        if (y % 2 === 0) {
          this._pinGrid[y][x].setPosition(x * 60 + 30, -(y * 60))
          this.pinRef.addChild(this._pinGrid[y][x])
        } else {
          this._pinGrid[y][x].setPosition(x * 60 + 59, -(y * 60))
          if (x !== this._pinGridWidth - 1) this.pinRef.addChild(this._pinGrid[y][x])
        }
      }
    }

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  // update(deltaTime: number) {}

  private _onBeginContact(a: Collider2D, b: Collider2D) {
    // console.log(a, b)
  }
}
