module.exports
=	function(grunt)
	{	
		grunt
			.loadNpmTasks(
				'steal-tools'
			)
		
		grunt
			.initConfig(
				{
					stealPluginify:
					{
						main:
						{
							system:
							{
								main:	'main'
							,	config:	__dirname+'/stealconfig.js'
							}
						}
					}
				}
		)

		grunt
			.registerTask(
				'build'
			,	[
					'stealPluginify'
				]
			)
	}