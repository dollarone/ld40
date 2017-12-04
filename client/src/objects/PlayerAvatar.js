class PlayerAvatar {

	constructor(game, frame){
		this.game = game
		this.sprite = this.game.add.sprite(0, -200, 'avatars_small')
        this.sprite.anchor.setTo(0.5)
        this.sprite.frame = frame
        this.hearts = this.game.add.sprite(0, 40, 'hearts')
        this.hearts.anchor.setTo(0.5)
        this.hearts.frame = 2
        this.sprite.addChild(this.hearts)
        this.x = 360
        this.y = -200
        this.nick = ""
        this.attack = 5
        this.defence = 8
        this.life = 3
        this.maxLife = 3
        this.square = 0
        this.base_y = 670
        this.nameLabel = this.game.add.text(0, 20, "")
        this.nameLabel.anchor.setTo(0.5)
        this.sprite.addChild(this.nameLabel)
        this.nameLabel.font = "Berkshire Swash"
        this.nameLabel.addColor('#aaa', 0)
	}
    setNick(name) {
        this.nick = name
        this.nameLabel.text = this.nick
    }
    setSquare(square) {
        this.square = square
        if (square < 9) {
            this.x = 360
            this.y = this.base_y - 72*square
        }
        else if (square < 17) {
            this.x = 360 + 72*(square-8)
            this.y = this.base_y - 72*8
        }
        else if (square < 25) {
            this.x = 360 + 72*8
            this.y = this.base_y - 72*8 + 72*(square-16)
        }
        else if (square < 31) {
            this.x = 360 + 72*8-72*(square-24)
            this.y = this.base_y
        }
        else if (square < 37) {
            this.x = 360 + 72*2
            this.y = this.base_y - 72*(square-30)
        }
        else if (square < 41) {
            this.x = 360 + 72*2 + 72*(square-36)
            this.y = this.base_y - 72*6
        }
        else if (square < 45) {
            this.x = 360 + 72*6
            this.y = this.base_y - 72*6 + 72*(square-40)
        }
        else if (square < 47) {
            this.x = 360 + 72*6 - 72*(square-44)
            this.y = this.base_y - 72*2
        }
        else if (square < 49) {
            this.x = 360 + 72*4
            this.y = this.base_y - 72*2 - 72*(square-46)
        }
        this.sprite.x = this.x
        this.sprite.y = this.y
    }
}


export default PlayerAvatar