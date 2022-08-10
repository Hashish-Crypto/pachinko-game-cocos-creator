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
  find,
  // UITransform,
} from 'cc'
import { PersistentNode } from './PersistentNode'

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
  private _respawnBallEnabled = true
  private _ballReleased = false
  private _persistentNode: PersistentNode | null = null

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)
    // const canvasHeight = this.canvasNode.getComponent(UITransform).contentSize.height
    // const canvasWidth = this.canvasNode.getComponent(UITransform).contentSize.width

    for (let y = 0; y < this._pinGridHeight; y += 1) {
      this._pinGrid[y] = []

      for (let x = 0; x < this._pinGridWidth; x += 1) {
        this._pinGrid[y][x] = instantiate(this.pinPrefab)
        if (y % 2 === 0) {
          this._pinGrid[y][x].setPosition(x * 58 + 75, -(y * 60))
          if (x !== this._pinGridWidth - 1) this.pinRef.addChild(this._pinGrid[y][x])
        } else {
          this._pinGrid[y][x].setPosition(x * 58 + 45, -(y * 60))
          this.pinRef.addChild(this._pinGrid[y][x])
        }
      }
    }

    this._ball = instantiate(this.ballPrefab)
    this._ball.setPosition(this._randomBallPosition(), 0)
    this._ball.getComponent(RigidBody2D).gravityScale = 0
    if (randomRangeInt(0, 2) === 0) {
      this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(6, 0)
    } else {
      this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(-6, 0)
    }
    this.ballRef.addChild(this._ball)

    this._setCash(this._persistentNode.cash)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    this.canvasNode.on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  update(deltaTime: number) {
    if (!this._ballReleased) {
      if (this._ball.position.x >= 150) {
        this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(-6, 0)
      } else if (this._ball.position.x <= -150) {
        this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(6, 0)
      }
    }
  }

  private _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.tag === 3 && b.tag === 1 && this._respawnBallEnabled) {
      this._respawnBall()
    } else if (a.tag === 4 && b.tag === 1 && this._respawnBallEnabled) {
      if (this._persistentNode.throwRounds >= 1) {
        if (a.node.name === 'Jackpot18') {
          this._setCash(Math.floor(this._persistentNode.cash * 1.8 * 100) / 100)
        } else if (a.node.name === 'Jackpot16') {
          this._setCash(Math.floor(this._persistentNode.cash * 1.6 * 100) / 100)
        } else if (a.node.name === 'Jackpot14') {
          this._setCash(Math.floor(this._persistentNode.cash * 1.4 * 100) / 100)
        } else if (a.node.name === 'Jackpot12') {
          this._setCash(Math.floor(this._persistentNode.cash * 1.2 * 100) / 100)
        } else if (a.node.name === 'Jackpot1') {
          this._setCash(Math.floor(this._persistentNode.cash * 1 * 100) / 100)
        } else if (a.node.name === 'Jackpot08') {
          this._setCash(Math.floor(this._persistentNode.cash * 0.8 * 100) / 100)
        } else if (a.node.name === 'Jackpot06') {
          this._setCash(Math.floor(this._persistentNode.cash * 0.6 * 100) / 100)
        } else if (a.node.name === 'Jackpot04') {
          this._setCash(Math.floor(this._persistentNode.cash * 0.4 * 100) / 100)
        } else if (a.node.name === 'Jackpot02') {
          this._setCash(Math.floor(this._persistentNode.cash * 0.2 * 100) / 100)
        }
        this._persistentNode.throwRounds -= 1
        this._respawnBall()
      }
      if (this._persistentNode.throwRounds === 0) {
        this._persistentNode.resetThrowRounds()
        director.loadScene('Menu')
      }
    }
  }

  private _onTouchScreen() {
    this._ballReleased = true
    this._ball.getComponent(RigidBody2D).gravityScale = 1
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
    this._ballReleased = false
    director.once(Director.EVENT_AFTER_PHYSICS, () => {
      this._ball.setPosition(this._randomBallPosition(), 0)
      this._ball.getComponent(RigidBody2D).gravityScale = 0
      if (randomRangeInt(0, 2) === 0) {
        this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(6, 0)
      } else {
        this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(-6, 0)
      }
      this._ball.getComponent(RigidBody2D).angularVelocity = 0
      this._respawnBallEnabled = true
    })
  }

  private _setCash(value: number) {
    this._persistentNode.cash = value
    this.cashLabel.string = 'HC$ ' + this._persistentNode.cash.toFixed(2)
  }
}
