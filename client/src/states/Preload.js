class Preload extends Phaser.State {

	preload() {
		/* Preload required assets */
		this.game.load.spritesheet('logo-tiles', 'assets/gfx/logo-tiles.png', 17, 16)
		this.game.load.spritesheet('chars', 'assets/gfx/chars.png', 32, 32)
		this.game.load.spritesheet('tiles', 'assets/gfx/tiles.png', 16, 16)
		this.game.load.audio('dollarone', 'assets/sfx/dollarone.ogg')
		this.game.load.image('onehourgamejamlogo', 'assets/gfx/onehourgamejamlogo.png')
		this.game.load.audio('onehourgamejamsplash', 'assets/sfx/onehourgamejamsplash.ogg')
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json')
		this.game.load.tilemap('level', 'assets/tilemaps/level.json', null, Phaser.Tilemap.TILED_JSON)
		this.game.load.image('ui', 'assets/gfx/ui2.png')
		this.game.load.image('grass', 'assets/gfx/ui3.png')
		this.game.load.image('trigger', 'assets/gfx/trigger.png')
		this.game.load.spritesheet('button', 'assets/gfx/button.png', 149, 44)
		this.game.load.spritesheet('avatars', 'assets/gfx/avatars.png', 230, 260)
		this.game.load.spritesheet('avatars_small', 'assets/gfx/avatars_small.png', 70, 80)
		this.game.load.spritesheet('traps', 'assets/gfx/traps.png', 76, 76)
		this.game.load.spritesheet('hearts', 'assets/gfx/hearts.png', 60, 16)
	}

	create() {
		//this.game.state.start("Main")
		this.game.state.start("Logo", true, false, "#111")
	}

}

export default Preload
