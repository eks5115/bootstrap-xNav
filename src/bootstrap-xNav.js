/**
 * Created by Chen_Sen on 2016/9/1.
 */

(function ($) {

    BootstrapXNav = function (el, options) {

        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();

        this.init();

    };

    BootstrapXNav.DEFAULTS = {
        data: {},

        method: 'get',
        url: undefined,
        ajax: undefined,
        cache: true,
        contentType: 'application/json',
        dataType: 'json',
        ajaxOptions: {},
        icons: {
            toggle: 'fa fa-chevron-down',
        },
        menuClass: 'btn btn-primary btn-block',
        submenuClass: 'btn btn-default btn-block',
        clickSubmenu: function (submenu) {

        },
    };

    BootstrapXNav.MENUDEFAULTS = {
        menuId: undefined,
        menuName: undefined,
        menuUrl: '#',
        menuIcon: undefined,
        submenu: [
            {
                menuId: undefined,
                menuName: undefined,
                menuUrl: '#',
                menuIcon: undefined,
            },
        ]
    };

    BootstrapXNav.prototype.init = function () {
        this.initMenu();
        this.initEvent();
        this.initServer();
    };

    BootstrapXNav.prototype.initMenu = function () {

    }

    BootstrapXNav.prototype.initServer = function () {
        var that = this;
        var request;
        request = $.extend({}, {
            type: this.options.method,
            url: this.options.url,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function(res) {
                this.load(res);
            },
            error: function(res) {
                // TODO
            }
        });
        
        $.ajax(request);
    }

    BootstrapXNav.prototype.initEvent = function(){
        this.$el.on('click', '.x-nav-title', {xNav: this,}, function (e) {
            var xNav = e.data.xNav,
                $this = $(this);
            xNav.toggle($this.attr('id'));
        });

        this.$el.on('click', '.x-nav-pane li', {xNav: this,}, function (e) {
            var xNav = e.data.xNav,
                data = xNav.options.data,
                id = $(this).attr('id');
            for (var i in data) {
                for (var j in data[i].submenu) {
                    if (data[i].submenu[j].menuName == id) {
                        xNav.options.clickSubmenu(data[i].submenu[j]);
                        break;
                    }
                }
            }
        });
    }


    /**
     * append menuItem
     *
     * @param menuOption
     *
     */
    BootstrapXNav.prototype.append = function (menuOption) {

        var $el = this.$el,
            menu = $.extend({}, BootstrapXNav.MENUDEFAULTS, menuOption),
            submenu = menu.submenu;

        var id = menu.menuName;

        if ($el.find("#" + id).length > 0) {
            throw new Error("menu haved: " + id);
        }

        //div x-nav-title
        var $xNavTitle = $('<div>', {
            id: id,
            class: 'x-nav-title',
        }).append($('<a>', {
                class: this.options.menuClass,
            }).append($('<i>', {
                    class: menu.menuIcon,
                }),
                menu.menuName,
                $('<i>', {
                    class: this.options.icons.toggle,
                })
            )
        );

        //div x-nav-pane
        var $ul = $('<ul>');
        for (var i in submenu) {
            $ul.append($('<li>', {
                    id: submenu[i].menuName,
                }).append(
                    $('<a>', {
                        class: this.options.submenuClass,
                    }).append(
                        submenu[i].menuName
                    )
                )
            );
        }
        var $xNavPane = $('<div>', {
            class: 'x-nav-pane'
        }).append($ul);

        $el.append($xNavTitle, $xNavPane);

        this.options.data.push(menu);
    };

    //BootstrapXNav.prototype.remove = function (id) {
    //    var $navTitle = this.$el.find('#' + id),
    //        $navPane = $navTitle.next('.x-nav-pane');
    //
    //    if (this.$el.find('#' + id + ' li').length == 0) {
    //        $navTitle.remove();
    //        $navPane.remove();
    //    } else {
    //        $navPane.remove('li#' + id);
    //    }
    //};

    BootstrapXNav.prototype.toggle = function (id) {

        var $active = this.$el.find('a.active');
        var $navTitle = $('#' + id),
            $navPane = $navTitle.next('.x-nav-pane');

        if ($active.length > 0) {
            //actived
            if (!$navTitle.find('a').is($($active[0]))) {
                //no self
                $active.removeClass('active');
                $($active[0]).parent().next('.x-nav-pane').slideUp();
                this.active(id);
            } else {
                //self
                this.disActive(id);
            }
        } else {
            // no active
            this.active(id);
        }
        $navPane.slideToggle();

    };

    BootstrapXNav.prototype.load = function(data){
        this.empty();
        for (var i in data) {
            this.append(data[i]);
        }
        this.options.data = data;
    }

    BootstrapXNav.prototype.empty = function () {
        this.$el.empty();
        this.$el.data = [];
    }

    BootstrapXNav.prototype.isActive = function (id) {
        return this.$el.find('#' + id + ' a.active').length > 0 ? true : false;
    };

    BootstrapXNav.prototype.active = function (id) {
        var $navTitle = this.$el.find('#' + id),
            $navPane = $navTitle.next('.x-nav-pane');

        if (this.$el.find('#' + id + ' li').length == 0) {
            $navTitle.find('a').addClass('active');
        } else {
            $navPane.find('#' + id + ' a').addClass('active');
        }
    };

    BootstrapXNav.prototype.disActive = function (id) {

        var $navTitle = this.$el.find('#' + id),
            $navPane = $navTitle.next('.x-nav-pane');

        if (this.$el.find('#' + id + ' li').length == 0) {
            $navTitle.find('a').removeClass('active');
        } else {
            $navPane.find('#' + id + ' a').removeClass('active');
        }

    };

    $.fn.bootstrapXNav = function (option) {
        var args = Array.prototype.slice.call(arguments, arguments.length - 1);

        var $this = $(this),
            data = $this.data('bootstrap.xNav'),
            options = $.extend({}, BootstrapXNav.DEFAULTS, typeof option === 'object' && option);

        if (!data) {
            $this.data('bootstrap.xNav', new BootstrapXNav(this, options));
        }

        return data;
    };
})(jQuery);
