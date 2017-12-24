import PlayerAvatar from 'objects/PlayerAvatar'

class Main extends Phaser.State {

	preload() {
		let game = this.game

		let main = this
		let WebFontConfig = {

		    //  'active' means all requested fonts have finished loading
		    //  We set a 1 second delay before calling 'createText'.
		    //  For some reason if we don't the browser cannot render the text the first time it's created.
		    active() { 
		    	game.time.events.add(Phaser.Timer.SECOND, main.createText, main) 
		    },

		    //  The Google Fonts we want to load (specify as many as you like in the array)
		    google: {
		      families: ['Berkshire Swash']
		    }
		}

    
		WebFont.load(WebFontConfig)
	}
	createText() {
	    this.nameLabel = this.add.text(130, 350, '')
		this.nameLabel.anchor.setTo(0.5)	
		this.nameLabel.font = "Berkshire Swash"
		this.nameLabel.addColor('#aaa', 0)
		this.nameLabel.visible = false

	    this.buttonLabel = this.add.text(140, 424, 'Join game')
		this.buttonLabel.font = "Berkshire Swash"
		this.buttonLabel.addColor('#aaa', 0)
		this.buttonLabel.anchor.setTo(0.5)

		this.labelsCreated = true

	    this.kingLabel = this.add.text(130, 30, 'King of the Mountain')
		this.kingLabel.anchor.setTo(0.5)	
		this.kingLabel.font = "Berkshire Swash"
		this.kingLabel.addColor('#aaa', 0)

	    
		this.kingNameLabel.anchor.setTo(0.5)	
		this.kingNameLabel.font = "Berkshire Swash"
		this.kingNameLabel.addColor('#aaa', 0)

	}
	create() {
		this.game.add.plugin(PhaserInput.Plugin)

		this.kingNameLabel = this.add.text(130, 335, '')

		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		this.game.stage.backgroundColor = '#000'//#98FB98'

		this.step = -1

		this.statusLabel = this.add.text(this.game.world.width/2 - 360, 10, '')
		this.timeLabel = this.add.text(700, 10, '')
		this.speed = 0

        this.gameover = false

        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R)
    	this.rKey.onDown.add(this.restart, this)
    	//this.map = new Map(this.game)

//    	this.player = new Player(this.game, 200, 200)
    	this.cursors = this.game.input.keyboard.createCursorKeys()

	    this.grass = this.game.add.sprite(this.game.width/2, this.game.height/2, 'grass')
	    this.grass.anchor.setTo(0.5)
	    this.ui = this.game.add.sprite(this.game.width/2, this.game.height/2, 'ui')
	    this.ui.anchor.setTo(0.5)

	    this.king_avatar_profile = this.game.add.sprite(120, 180, 'avatars')
	    this.king_avatar_profile.frame = 1
	    this.king_avatar_profile.anchor.setTo(0.5)
	    this.king_avatar_profile.visible = false

	    this.avatar_profile = this.game.add.sprite(120, 580, 'avatars')
	    this.avatar_profile.frame = 1
	    this.avatar_profile.anchor.setTo(0.5)
	    this.avatar_profile.visible = false
	    
//	    this.player = this.game.add.sprite(360, 675, 'warrior_small')
//	    this.player.anchor.setTo(0.5)
	    //player.scale.setTo(0.2)
	    this.playerName = "anon"
	    this.myId = null

	    this.nameInput = this.game.add.inputField(75, 730, {height: 20, width:110, max: 12, font: '14px Monospace'})
	    this.nameInput.anchor.setTo(0.01, 0.1)
	    this.nameInput.setText("Redgar")

	    this.openConnection()
	    
		this.scream_sfx = this.game.add.audio('scream')
		this.sword_sfx = this.game.add.audio('sword')
		this.trumpet_sfx = this.game.add.audio('trumpet')
		this.die_sfx = this.game.add.audio('die')
    	this.start_sfx = this.game.add.audio('start')


        this.nextTurnButton = this.game.add.button(140, 422, 'button', this.nextTurn, this)//, null, null, 0, 1)
        this.nextTurnButton.anchor.setTo(0.5)
        this.nextTurnButton._onUpFrame = 0
        this.nextTurnButton._onDownFrame = 1
        this.nextTurnButton.input.useHandCursor = true
        this.nextTurnCooldown = 5
        this.players = []
        this.monsters = []

        this.started = false
        this.state = 0
        this.startButtonClicked = false

		this.triggers = []
        this.traps = []

		this.addTrap(23,this.game.width/2-3+72*6, this.game.height/2+72*3,2)
		this.addTrap(24,this.game.width/2-3+72*6, this.game.height/2+72*4,1)
		this.addTrap(25,this.game.width/2-3+72*5, this.game.height/2+72*4,2)
		this.addTrap(29,this.game.width/2-3+72, this.game.height/2+72*4,2)
		this.addTrap(37,this.game.width/2-3+72, this.game.height/2-72*2,2)
	    this.addTrap(31,this.game.width/2-3, this.game.height/2+72*2,0)
	    this.addTrap(35,this.game.width/2-3, this.game.height/2-72,1)
	    this.addTrap(19,this.game.width/2-3+72*6, this.game.height/2-72,0)
	    this.addTrap(41,this.game.width/2-3+72*4, this.game.height/2-72,2)
	    this.addTrap(42,this.game.width/2-3+72*4, this.game.height/2,2)
	    this.addTrap(14,this.game.width/2-3+72*4, this.game.height/2-72*4,1)
	    this.addTrap(15,this.game.width/2-3+72*5, this.game.height/2-72*4,2)
	    this.addTrap(17,this.game.width/2-3+72*6, this.game.height/2-72*3,2)
	    this.addTrap(18,this.game.width/2-3+72*6, this.game.height/2-72*2,0)
	    this.addTrap(13,this.game.width/2-3+72*3, this.game.height/2-72*4,2)
	    this.addTrap(38,this.game.width/2-3+72*3, this.game.height/2-72*2,2)
	    this.addTrap(44,this.game.width/2-3+72*3, this.game.height/2+72*2,1)

		this.addTrap(3,this.game.width/2-3-72-72, this.game.height/2+72,0)
	    this.addTrap(21,this.game.width/2-3+72*6, this.game.height/2+72,1)
	    this.addTrap(43,this.game.width/2-3+72*4, this.game.height/2+72,2)
	    this.addTrap(47,this.game.width/2-3+72*2, this.game.height/2+72,2)

	    this.addTrap(6,this.game.width/2-3-72-72, this.game.height/2-72*2,2)

		this.addTrap(2,this.game.width/2-3-72-72, this.game.height/2+72*2,2)
		this.addTrap(5,this.game.width/2-3-72-72, this.game.height/2-72,1)
		this.addTrap(8,this.game.width/2-3-72-72, this.game.height/2-72*4,2)
		this.addTrap(11,this.game.width/2-3+72, this.game.height/2-72*4,2)
		this.addTrap(16,this.game.width/2-3+72*6, this.game.height/2-72*4,0)
		this.addTrap(20,this.game.width/2-3+72*6, this.game.height/2,2)
		this.addTrap(27,this.game.width/2-3+72*3, this.game.height/2+72*4,1)
		this.addTrap(33,this.game.width/2-3, this.game.height/2+72,2)
		this.addTrap(36,this.game.width/2-3, this.game.height/2-72*2,0)
		this.addTrap(10,this.game.width/2-3, this.game.height/2-72*4,2)

		this.addTrigger(1,this.game.width/2-3-72-72, this.game.height/2+72*3)
	    this.addTrigger(2,this.game.width/2-3-72-72, this.game.height/2+72*2)
	    this.addTrigger(5,this.game.width/2-3-72-72, this.game.height/2-72)
	    this.addTrigger(8,this.game.width/2-3-72-72, this.game.height/2-72*4)
	    this.addTrigger(11,this.game.width/2-3+72, this.game.height/2-72*4)
	    this.addTrigger(16,this.game.width/2-3+72*6, this.game.height/2-72*4)
	    this.addTrigger(20,this.game.width/2-3+72*6, this.game.height/2)
	    this.addTrigger(27,this.game.width/2-3+72*3, this.game.height/2+72*4)
	    this.addTrigger(33,this.game.width/2-3, this.game.height/2+72)
	    this.addTrigger(36,this.game.width/2-3, this.game.height/2-72*2)

	}
	addTrap(i,x,y,frame) {
		this.traps[i] = this.game.add.sprite(x, y, 'traps')
	    this.traps[i].anchor.setTo(0.5)
	    this.traps[i].visible = false
	    this.traps[i].frame = frame
	}
	addTrigger(i,x,y) {
		this.triggers[i] = this.game.add.sprite(x, y, 'trigger')
	    this.triggers[i].anchor.setTo(0.5)
	}

	restart() {
		this.game.state.restart()
	}

	endgame() {
		this.gameover = true
	}
	killparticle(part, wall) {
		part.kill()
	}
	update() {
		this.step += 1

		if (this.nextTurnCooldown > 0) {
			this.nextTurnCooldown--
		}
	}
	
	nextTurn() {
        if (this.nextTurnCooldown == 0) {
            this.nextTurnCooldown = 2
            this.ws.send(JSON.stringify({action: "next", nick:this.nameInput.value}))
            this.startButtonClicked = true
        }

	}


    openConnection() {
        this.ws = new WebSocket("ws://localhost:8981")   ///dollarone.games:8981")
        this.connected = false
        this.ws.onmessage = this.onMessage.bind(this)
        this.ws.onerror = this.displayError.bind(this)
        this.ws.onopen = this.connectionOpen.bind(this)
    }

    connectionOpen() {
        this.connected = true

    }

    onMessage(message) {

        var msg = JSON.parse(message.data);
        //console.log(msg)
        if (undefined == msg.status) {
        	//do nuthing
        }
        else if (msg.status == "newTurn") {
    		let play = false

        	for(let i = 0; i < msg.monsters.length; i++) {
        		if (undefined == this.monsters[i]) {
        			//create
        			this.monsters[i] = new PlayerAvatar(this.game, msg.monsters[i]["sprite"])
        		}
        		if (msg.monsters[i]["alive"]) {
	       			this.monsters[i].setSquare(msg.monsters[i]["square"])
    	    		this.monsters[i].sprite.frame = msg.monsters[i]["sprite"]
        			this.monsters[i].setNick(msg.monsters[i]["nick"])
        			this.kingNameLabel.text = msg.monsters[i]["nick"]
        			this.king_avatar_profile.frame = msg.monsters[i]["sprite"]
        			this.king_avatar_profile.visible = true
        			this.monsters[i].hearts.frame = msg.monsters[i]["life"] -1
        			if (this.monsters[i]["life"] < 1) {
		       			this.trumpet_sfx.play()
	        			play = true    	    		
        			}
    	    	}
        		this.monsters[i].sprite.visible = msg.monsters[i]["alive"]
        	}

        	for(let i = 0; i < msg.players.length; i++) {
        		if (undefined == this.players[i]) {
        			//create
        			this.players[i] = new PlayerAvatar(this.game, msg.players[i]["state"])
        			//console.log("created" + this.players[i])
        		//	console.log("frame:" + msg.players[i]["sprite"])
        		}
        		if (msg.players[i]["alive"]) {
	        		this.players[i].setSquare(msg.players[i]["square"])
	        		this.players[i]["state"] = msg.players[i]["state"]
	        		this.players[i].sprite.frame = msg.players[i]["sprite"]
	        		this.players[i].setNick(msg.players[i]["nick"])
	        		if (this.players[i].hearts.frame != msg.players[i]["life"] -1) {
	        			this.sword_sfx.play()
	        			if (msg.players[i]["life"] < 1) {
		        			play = true
		        			this.die_sfx.play()
	        			}
	        		}
	        		this.players[i].hearts.frame = msg.players[i]["life"] -1
	        	}
	        	if (this.players[i].sprite.visible && msg.players[i]["alive"] == false) {
	        	if (!play && this.startButtonClicked) {
	    				this.scream_sfx.play()
	    			}
	        	}
	        	this.players[i].sprite.visible = msg.players[i]["alive"]
        	}
        	for (let trap in this.traps) {
        		this.traps[trap].visible = false
        	}
        	for (let i = 0; i < msg.traps.length; i++) {
        		this.traps[msg.traps[i]].visible = true
        	}
        	if (this.labelsCreated) {
				this.nameLabel = "Life: " + this.players[this.myId]["life"]
			}

        }
        else if (msg.status == "registered") {
        	this.started = true
        	this.myId = msg.myId
        	this.start_sfx.play()
 //       	console.log("myId  = " + msg.myId)
        	
//        	this.nameLabel.text = 'connected ' + this.myId;
        }
        

        if (this.labelsCreated && this.myId != null) {
        	
        	
		//console.log("lable " + this.labelsCreated + " and " + this.myId + " / " + this.players[this.myId]["state"])
        	// if next has monster, attack, or
        	this.avatar_profile.frame = this.players[this.myId].sprite.frame
        	let action = "Join game"
        	switch(this.players[this.myId]["state"]) {
        		case 1: action = "Move"
	        	this.avatar_profile.visible = true
        			break
        		case 2: action = "Attack"
	            	this.avatar_profile.visible = true
    				break
        		case 3: action = "Try again!"
        			this.avatar_profile.visible = false
        			break
        		case 10: action = "Restart"
        			this.avatar_profile.visible = false
        			break
        	}
        	this.buttonLabel.text = action +""
	    }

        
    }

    displayError(err) {
        console.log('Websocketerror - probably the server died. Sorry! Error: ' + err)
    }
	
	
	render() {
	//	this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00")
		//this.game.debug.body(this.player.sprite)
	}
}

export default Main
