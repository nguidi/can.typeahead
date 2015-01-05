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
	//	Funciones de la instancia (Publicas)
		init: function(element, options)
		{	
			this.itemsToRender
			=	new can.List(this.options.source)
			
			this.$menu
			=	can.$('<div>')
					.css('position','relative')
					.appendTo(this.element.parent())
			
			var	fragment
			=	new can.mustache(this.options.template)

			this.$menu.html(fragment(this.itemsToRender))
			
			this.$menu.on(
				{
					mouseenter:	can.proxy(this.mouseenter,this)
				,	mouseleave:	can.proxy(this.mouseleave,this)
				}
			)
		}
	
	,	filter: function(source)
		{
			var	self
			=	this
			
			var filtered
			=	source.filter(can.proxy(this.validateQuery,this))
			
			filtered.forEach(can.proxy(this.highlighter,this))
			
			this.itemsToRender.replace(filtered)
			
			this.$menu.find('li a').on(
				{
					click:			can.proxy(this.select,this)
				,	onmouseover:	can.proxy(this.hover,this)
				}
			)
			
			this.$active
			=	this.$menu.find('li:first')
			
			this.$active.addClass('active')
			
			this.show()
		}
	
	,	getItemDisplay: function(item)
		{
			return	can.isPlainObject(item)
					?	item[this.options.sourceKey]
					:	item instanceof can.Map
						?	item.attr(this.options.sourceKey)
						:	item
		}
	
	,	validateQuery: function(item)
		{
			return	this.getItemDisplay(item).toLowerCase().indexOf(this.query.toLowerCase()) > -1
		}
	
	,	search: function(query)
		{
			this.query = query
			
			if	(can.isArray(this.options.source))
				this.filter(this.options.source)
			else
				if	(can.isDeferred(this.options.source))
					this.options.source.then(can.proxy(this.filter,this))
				else
					this.options.source(query)
						.then(
							can.proxy(this._build_menu,this)	
						)
		}
	
	,	highlighter: function(item, index, list)
		{
			var	i
			=	this.getItemDisplay(item).toLowerCase().indexOf(this.query.toLowerCase())
			,	leftPart
			=	this.getItemDisplay(item).substr(0, i)
			,	middlePart
			=	this.getItemDisplay(item).substr(i, this.query.length)
			,	rightPart
			=	this.getItemDisplay(item).substr(i + this.query.length)
			
			list[index] =	{
								item:	item
							,	value:	leftPart+'<strong>'+middlePart+'</strong>'+rightPart
							}
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
	
	,	select: function(ev)
		{
			var	$a
			=	(ev)
				?	can.$(ev.target)
				:	this.$menu.find('li.active a')
			
			this.element.val(this.getItemDisplay($a.data('typeahead').attr('item')))
			
			this.element.data('value',$a.data('typeahead').attr('item'))
			
			this.hide()
			
			this.$menu.find('li.active').removeClass('active')
			
			$a.parent().addClass('active')
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
	
  	,	next: function(event)
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
			
			var	$prev = this.$active.prev()

			if (!$prev.length)
				$prev = this.$menu.find('li:last')

			$prev.addClass('active')
			
			this.$active = $prev
		}
	
	,	show: function()
		{
			this.$menu.find('ul').css('display','block')
			this.shown = true
		}
	
	,	hide: function()
		{
			this.$menu.find('ul').css('display','none')
			this.shown = false
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
					if (!this.shown) return
					this.select()
					break
				
				case 27:	// escape
					if (!this.shown) return
					this.hide()
					break
				
				default:
					this.lookup(el)
			}

			ev.stopPropagation()
			ev.preventDefault()
		}
	
	,	'focus': function(el, ev)
		{
			this.focused = true
			if	(can.$(el).val().length >= this.options.minLength)
				this.show()
		}
	
	,	'blur': function (el, ev)
		{
			this.focused = false
			if (!this.mouseover && this.shown)
				this.hide()
		}
	
	,	hover:	function(ev)
		{
			this.$menu.find('li.active').removeClass('active')
			can.$(ev.target).parent().addClass('active')
		}
	
	,	mouseenter: function(ev)
		{
			this.mouseover = true
		}
	
	,	mouseleave: function(ev)
		{
			this.mouseover = false
			if (!this.focused && this.shown)
				this.hide()
		}
	}
)