import	'can/control'
import	'can/construct/super'
import	'can/control/plugin'
import	'can/observe'
import	'can/view/mustache'

can.Control(
	'can.Typeahead'
,	{
	//	Nombre del plugin
		pluginName:	'typeahead'
	//	Opciones por defecto
	,	defaults:
		{
		/*
			minLength	>	Longitud minima necesaria para realizar la busqueda 
			dispalyKey	>	Atributo a mostrar (en caso de que sea un objeto o un observe)
			timeout		>	Tiempo de espera entre cada tecla para realizar una busqueda
			itemView	>	Vista del item
			menuView	>	Vista del menu
			source		>	Fuente de donde obtener la informacion para el typeahead
			query		>	Parametros adicionales a la query usada en una peticion ajax
		*/
			minLength:	3
		,	displayKey:	'name'
		,	timeout:	400
		,	itemView:	'<li><a>{{.}}</a></li>'
		,	menuView:	'<ul class="typeahead dropdown-menu"></ul>'
		//,	ajax:		undefined
		,	source:		undefined
		//,	model: 		undefined
		,	query:		{}
		}
	}
,	{
		init: function(element, options)
		{	
			this.itemsToRender
			=	new can.List(this.options.source)
			
			this.$menu
			=	can.$('<div>')
					.css('position','relative')
					.appendTo(
						this.element.parent()
					)
			
			var	fragment
			=	new can.mustache(
					this.options.template
				)

			this.$menu.html(
				fragment(this.itemsToRender)
			)
		}
	
	,	filter: function(query)
		{
			this.itemsToRender.replace(
				this.options.source.filter(
					function(item)
					{
						return	item.toLowerCase().indexOf(query.toLowerCase()) > -1
					}
				)
			)
			
			this.show()
		}
	
	,	search: function(query)
		{
			if	(can.isArray(this.options.source))
				this.filter(query)
			else
				this.options.source(query)
					.then(
						can.proxy(this._build_menu,this)	
					)
		}
	
	,	lookup: function(el)
		{
			var	self = this
			this.searchTimer && clearTimeout(this.searchTimer)
			if	(can.$(el).val().length >= this.options.minLength)
				this.searchTimer
				=	setTimeout(
						function()
						{
							self.search(can.$(el).val())
						}
					,	this.options.timeout
					)
		}
	
	,	move: function(keyCode)
		{
			switch(keyCode) {
				case 38:	//	arriba
					this.prev()
					break

				case 40:	//	abajo
					this.next()
					break
			}
		}
	  , next: function(event)
		{
			this.$active.removeClass('active')
			
			var $next = this.$active.next()
		
			if	(!$next.length)
				$next = this.$menu.find('li:first')

			$next.addClass('active')

			this.$active = $next
		}

	,	prev: function()
		{
			this.$active.removeClass('active')
			
			var	$prev = this.$active.prev();

			if (!$prev.length)
				$prev = this.$menu.find('li:last')

			$prev.addClass('active');
			
			this.$active = $prev
		}
	
	,	show: function()
		{
			this.$menu.find('ul').css('display','block')
			this.shown
			=	true
		}
	
	,	hide: function()
		{
			this.$menu.find('ul').css('display','none')
			this.shown
			=	false
		}
	
	,	'keyup': function(el, ev)
		{
			switch(ev.keyCode) {
				case 40:	// abajo
				case 38:	// arriba
					if (!this.shown || ev.shiftKey) return
					ev.preventDefault()
					this.move(ev.keyCode)
					break
				
				case 9:		// tab
				case 13:	// enter
					if (!this.shown) return;
					this.select()
					break
				
				case 27:	// escape
					if (!this.shown) return;
					this.hide()
					break
				
				default:
					this.lookup(el)
			}

			e.stopPropagation()
			e.preventDefault()
		}
	
	,	'focus': function(el, ev)
		{
			if	(can.$(el).val().length >= this.options.minLength)
				this.show()
		}
	
	,	'blur': function(el, ev)
		{
			this.hide()
		}
	}
)