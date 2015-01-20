var	stealTools
=	require('steal-tools')

stealTools
	.build(
		{
			main:
			[
				'demo'
			]
		,	config:	__dirname+'/stealconfig.js'
		}
	,	{
			minify: true
		,	debug: true
		,	quiet: false
		}
	)