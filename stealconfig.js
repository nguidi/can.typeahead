System
	.config(
	{
		map:
		{
			'bootstrap':	'bower_components/bootstrap/dist'
		,	'can':			'bower_components/canjs/amd/can'
		}
	,	paths:
		{
			'jquery':		'bower_components/jquery/jquery.min.js'
		}
	,	meta:
		{
			'jquery':
			{
				exports: 'jQuery'
			}
		}
	}
);