import {
  _decorator,
  Component,
  Node,
  Collider2D,
  PhysicsSystem2D,
  Contact2DType,
  instantiate,
  Prefab,
  RigidBody2D,
  director,
  Director,
  Vec2,
  randomRangeInt,
  Label,
  // UITransform,
} from 'cc'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Node })
  private canvasNode: Node | null = null

  @property({ type: Node })
  private pinRef: Node | null = null

  @property({ type: Prefab })
  private pinPrefab: Prefab | null = null

  @property({ type: Node })
  private ballRef: Node | null = null

  @property({ type: Prefab })
  private ballPrefab: Prefab | null = null

  @property({ type: Label })
  public cashLabel: Label | null = null

  private _pinGrid: Node[][] = []
  private _pinGridHeight: number = 7
  private _pinGridWidth: number = 16
  private _ball: Node | null = null
  private _cash: number = 10
  private _respawnBallEnabled = true

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
          this._pinGrid[y][x].setPosition(x * 60 + 60, -(y * 60))
          if (x !== this._pinGridWidth - 1) this.pinRef.addChild(this._pinGrid[y][x])
        }
      }
    }

    this._ball = instantiate(this.ballPrefab)
    this._ball.setPosition(this._randomBallPosition(), 0)
    this.ballRef.addChild(this._ball)

    this._setCash(this._cash)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  // update(deltaTime: number) {}

  private _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.tag === 3 && b.tag === 1 && this._respawnBallEnabled) {
      this._respawnBall()
    } else if (a.tag === 4 && b.tag === 1 && this._respawnBallEnabled) {
      this._respawnBall()
      if (a.node.name === 'Jackpot1000') {
        this._setCash(Math.floor(this._cash * 1000 * 100) / 100)
      } else if (a.node.name === 'Jackpot130') {
        this._setCash(Math.floor(this._cash * 130 * 100) / 100)
      } else if (a.node.name === 'Jackpot26') {
        this._setCash(Math.floor(this._cash * 26 * 100) / 100)
      } else if (a.node.name === 'Jackpot9') {
        this._setCash(Math.floor(this._cash * 9 * 100) / 100)
      } else if (a.node.name === 'Jackpot4') {
        this._setCash(Math.floor(this._cash * 4 * 100) / 100)
      } else if (a.node.name === 'Jackpot2') {
        this._setCash(Math.floor(this._cash * 2 * 100) / 100)
      } else if (a.node.name === 'Jackpot08') {
        this._setCash(Math.floor(this._cash * 0.8 * 100) / 100)
      } else if (a.node.name === 'Jackpot04') {
        this._setCash(Math.floor(this._cash * 0.4 * 100) / 100)
      } else if (a.node.name === 'Jackpot02') {
        this._setCash(Math.floor(this._cash * 0.5 * 100) / 100)
      }
    }
  }

  private _randomBallPosition() {
    const randomNumber1 = randomRangeInt(0, 49) / 10 - 5
    const randomNumber2 = randomRangeInt(51, 100) / 10 - 5
    if (randomRangeInt(0, 2) === 0) {
      return randomNumber1
    }
    return randomNumber2
  }

  private _respawnBall() {
    this._respawnBallEnabled = false
    director.once(Director.EVENT_AFTER_PHYSICS, () => {
      const ballBody = this._ball.getComponent(RigidBody2D)
      ballBody.linearVelocity = new Vec2(0, 0)
      ballBody.angularVelocity = 0
      this._ball.setPosition(this._randomBallPosition(), 0)
      this._respawnBallEnabled = true
    })
  }

  private _setCash(value: number) {
    this._cash = value
    this.cashLabel.string = 'HC$ ' + this._cash.toFixed(2)
  }
}
