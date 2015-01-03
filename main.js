import	'jquery'
import	'bootstrap/js/bootstrap'
import	'bootstrap/css/bootstrap.css!'
import	'can/model'
//import	'can/util/fixture'
import	'lib/typeahead'

/*
can.fixture(
	'POST /paises'
,	function(req,res)
	{
		return	res(
					200
				,	'success'
				,	can.map(
						can.grep(
							['Argentina','Alemania','Angola','Argelia','Austria','Benin','Bolivia','Brasil']
						,	function(pais)
							{
								return	pais.toLowerCase().indexOf(req.data.value.toLowerCase()) != -1
							}
						)
					,	function(pais)
						{
							return	{nombre: pais}
						}
					)
				)
	}
)
*/

can.Model(
	'Paises'
,	{
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
	,	source: 	can.map(
						['Argentina','Alemania','Angola','Argelia','Austria','Benin','Bolivia','Brasil']
					,	function(pais)
						{
							return	{nombre: pais}
						}
					)
	}
)

$('#ajax').typeahead(
	{
		displayKey:	'nombre'
	,	ajax:
		{
			url:	'/paises'
		}
	}
)

$('#model').typeahead(
	{
		displayKey:	'nombre'
	,	ajax:		Paises.filter
	}
)


$('#customview').typeahead(
	{
		displayKey:	'nombre'
	,	source: 	can.map(
						['Argentina','Alemania','Angola','Argelia','Austria','Benin','Bolivia','Brasil']
					,	function(pais)
						{
							return	{nombre: pais, descripcion: 'Descripción del Pais '+pais}
						}
					)
	,	view_item:	'#custom_view'
	}
)

$('#empty').typeahead(
	{	}
)