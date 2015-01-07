steal(
	'can/model'
,	'can/util/fixture'
,	'can/view/mustache'
,	'typeahead.js'
,	function()
	{
		var	paisesArray
		=	['Argentina','Alemania','Angola','Argelia','Austria','Benin','Bolivia','Brasil']

		function filterPaises(query)
		{
			return	can.map(
						can.grep(
							paisesArray
						,	function(pais)
							{
								return	pais.toLowerCase().indexOf(query.toLowerCase()) != -1
							}
						)
					,	function(pais)
						{
							return	{nombre: pais}
						}
					)
		}

		can.fixture(
			'POST /paises'
		,	function(req,res)
			{
				return	res(
							200
						,	'success'
						,	filterPaises(req.data.query)
						)
			}
		)

		can.fixture(
			'GET /paises'
		,	function(req,res)
			{
				return	res(
							200
						,	'success'
						,	filterPaises(req.data.query)
						)
			}
		)

		Paises = can.Model.extend(
			{
				filter: function(query)
				{
					return	can.ajax(
								{
									url: '/paises'
								,	method: 'POST'
								,	data: query
								}
							)
				}
			}
		,	{	}
		)

		$('#array').typeahead(
			{
				displayKey:	'nombre'
			,	view:		'#bootstrapView'
			,	source: 	can.map(
								paisesArray
							,	function(pais)
								{
									return	{nombre: pais}
								}
							)
			}
		)

		$('#ajaxPOST').typeahead(
			{
				displayKey:	'nombre'
			,	view:		'#bootstrapView'
			,	source:
				{
					url:	'/paises'
				,	type:	'POST'
				}
			}
		)

		$('#ajaxGET').typeahead(
			{
				displayKey:	'nombre'
			,	view:		'#bootstrapView'
			,	source:
				{
					url:	'/paises'
				,	type:	'GET'
				}
			}
		)

		$('#model').typeahead(
			{
				displayKey:	'nombre'
			,	view:		'#bootstrapView'
			,	source:		Paises.filter
			}
		)


		$('#customview').typeahead(
			{
				displayKey:	'nombre'
			,	view:		'#bootstrapCustomView'
			,	source: 	can.map(
								paisesArray
							,	function(pais)
								{
									return	{nombre: pais, descripcion: 'Descripción del Pais '+pais}
								}
							)
			}
		)

		$('#empty').typeahead(
			{	}
		)
	}
)