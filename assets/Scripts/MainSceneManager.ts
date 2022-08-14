import exactMath from 'exact-math'
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
  Button,
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
  public potLabel: Label | null = null

  @property({ type: Label })
  public hitLabel: Label | null = null

  @property({ type: Label })
  public prizeLabel: Label | null = null

  @property({ type: Label })
  public throwRoundsLabel: Label | null = null

  @property({ type: Node })
  private gameOverUI: Node | null = null

  @property({ type: Node })
  private menuButton: Node | null = null

  private _pinGrid: Node[][] = []
  private _pinGridHeight: number = 7
  private _pinGridWidth: number = 16
  private _ball: Node | null = null
  private _respawnBallEnabled = true
  private _ballReleased = false
  private _persistentNode: PersistentNode | null = null
  private _pot: number | null = null

  onLoad() {
    this.gameOverUI.active = false
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)
    // const canvasHeight = this.canvasNode.getComponent(UITransform).contentSize.height
    // const canvasWidth = this.canvasNode.getComponent(UITransform).contentSize.width
    this._setHit(this._persistentNode.hit)
    this._setPot(this._persistentNode.bet)
    this._setPrize(this._persistentNode.prize)
    this._setThrowRounds(this._persistentNode.throwRounds)

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

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    this.canvasNode.on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  update(deltaTime: number) {
    if (!this._ballReleased) {
      if (this._ball.position.x >= 175) {
        this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(-6, 0)
      } else if (this._ball.position.x <= -175) {
        this._ball.getComponent(RigidBody2D).linearVelocity = new Vec2(6, 0)
      }
    }
  }

  private _onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.tag === 3 && b.tag === 1 && this._respawnBallEnabled) {
      this._respawnBall()
    } else if (a.tag === 4 && b.tag === 1 && this._respawnBallEnabled) {
      if (a.node.name === 'Jackpot18') {
        this._setPot(exactMath.mul(this._pot, 1.8))
      } else if (a.node.name === 'Jackpot16') {
        this._setPot(exactMath.mul(this._pot, 1.6))
      } else if (a.node.name === 'Jackpot14') {
        this._setPot(exactMath.mul(this._pot, 1.4))
      } else if (a.node.name === 'Jackpot12') {
        this._setPot(exactMath.mul(this._pot, 1.2))
      } else if (a.node.name === 'Jackpot1') {
        this._setPot(exactMath.mul(this._pot, 1))
      } else if (a.node.name === 'Jackpot08') {
        this._setPot(exactMath.mul(this._pot, 0.8))
      } else if (a.node.name === 'Jackpot06') {
        this._setPot(exactMath.mul(this._pot, 0.6))
      } else if (a.node.name === 'Jackpot04') {
        this._setPot(exactMath.mul(this._pot, 0.4))
      } else if (a.node.name === 'Jackpot02') {
        this._setPot(exactMath.mul(this._pot, 0.2))
      }
      this._setThrowRounds(this._persistentNode.throwRounds - 1)

      if (this._persistentNode.throwRounds >= 1) {
        this._respawnBall()
      } else if (this._persistentNode.throwRounds === 0) {
        this._respawnBallEnabled = false
        this.gameOverUI.active = true

        if (this._persistentNode.betTarget < 1 && this._persistentNode.hit >= this._pot) {
          this._persistentNode.balance += this._persistentNode.prize
          this.gameOverUI.getChildByName('WinStateLabel').getComponent(Label).string = 'You win!'
          this.gameOverUI.getChildByName('PrizeStateLabel').getComponent(Label).string =
            'Prize: HC$' + this._persistentNode.prize.toFixed(2)
        } else if (this._persistentNode.betTarget > 1 && this._persistentNode.hit <= this._pot) {
          this._persistentNode.balance += this._persistentNode.prize
          this.gameOverUI.getChildByName('WinStateLabel').getComponent(Label).string = 'You win!'
          this.gameOverUI.getChildByName('PrizeStateLabel').getComponent(Label).string =
            'Prize: HC$' + this._persistentNode.prize.toFixed(2)
        } else {
          this._persistentNode.balance -= this._persistentNode.prize
          this.gameOverUI.getChildByName('WinStateLabel').getComponent(Label).string = 'You loose!'
          this.gameOverUI.getChildByName('PrizeStateLabel').getComponent(Label).string = 'Prize: HC$0.00'
        }
        this.gameOverUI.getChildByName('BetStateLabel').getComponent(Label).string =
          'Bet: HC$' + this._persistentNode.bet.toFixed(2)
        this.gameOverUI.getChildByName('PotStateLabel').getComponent(Label).string =
          'Final pot: HC$' + this._pot.toFixed(2)
        if (this._persistentNode.betTarget < 1) {
          this.gameOverUI.getChildByName('HitStateLabel').getComponent(Label).string =
            'To hit less than: HC$' + this._persistentNode.hit.toFixed(2)
        } else if (this._persistentNode.betTarget > 1) {
          this.gameOverUI.getChildByName('HitStateLabel').getComponent(Label).string =
            'To hit more than: HC$' + this._persistentNode.hit.toFixed(2)
        }
        this.gameOverUI.getChildByName('BalanceStateLabel').getComponent(Label).string =
          'Balance: HC$' + this._persistentNode.balance.toFixed(2)

        this.menuButton.on(Button.EventType.CLICK, this._menu, this)
      }
    }
  }

  private _menu() {
    director.loadScene('Menu')
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

  private _setHit(value: number) {
    this._persistentNode.hit = value
    this.hitLabel.string = 'To hit: HC$' + this._persistentNode.hit.toFixed(2)
  }

  private _setPot(value: number) {
    this._pot = exactMath.floor(value, -2)
    this.potLabel.string = 'Pot: HC$' + this._pot.toFixed(2)
  }

  private _setPrize(value: number) {
    this._persistentNode.prize = value
    this.prizeLabel.string = 'Prize: HC$' + this._persistentNode.prize.toFixed(2)
  }

  private _setThrowRounds(value: number) {
    this._persistentNode.throwRounds = value
    this.throwRoundsLabel.string = 'Throws: ' + this._persistentNode.throwRounds
  }
}
