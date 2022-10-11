'use strict'

// Set Prototype
const $proto = {};

/**
 * Toast Message
 * @returns void
 */
$proto.toastMessage = message => {
    const destroy = el => {
        new Promise (resolve => {
            setTimeout(() => {
                el.classList.remove('on');
                resolve();
            }, 3000);
        })
          .then(() => {
              setTimeout(() => {
                  el.remove();
              }, 200);
          });
    };

    const create = async () => {
        const el = document.createElement('span');
        el.classList.add('toast-message');
        el.innerHTML = message;
        document.body.appendChild(el);
        await new Promise (resolve => {
            setTimeout(() => el.classList.add('on'));
            resolve();
        })
          .then(() => destroy(el));
        return el
    };

    create();
};


/**
 * Copy To ClipBoard
 * @returns void
 */
$proto.copyToClipboard = (string, message) => {
    const el = document.createElement('textarea');
    el.value = string;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }

    $proto.toastMessage(message ? message : '클립보드에 복사되었습니다.')
};


/**
 * Icons Components Click To Clipboard
 * @returns void
 */
$proto.iconCopyToClipboard = evt => {
    const html = evt.currentTarget.childNodes[1].childNodes[1].outerHTML;
    const message = evt.currentTarget.children[1].children[0].innerHTML;
    $proto.copyToClipboard(html, `\'${message}\' 아이콘을 클립보드에 복사하였습니다.`);
};


/**
 * Tree Menu
 * @returns void
 */
$proto.treeMenu = () => {
    const option = {
        animationSpeed: 500,
        accordion: true
    };

    const selector = {
        treeWrapper: '.menu-accordion-wrapper',
        tree: '.menu-accordion',
        treeView: '.tree-view',
        treeViewMenu: 'tree-view-menu',
        open: '.open, active',
        active: 'active',
        disabled: '.disabled'
    }

    const className = {
        open: 'open',
        tree: 'tree',
        side: 'side'
    }
    const init = function (option) {
        const initialize = function () {
            $.each($(selector.tree + '.side'), function (index, item) {
                const treeViewMenu = $(item).find('.' + selector.treeViewMenu)
                let treeOpenWidth = $(item).closest('.mega-menu').length > 0 ? 320 : 230
                const searchBar = $(item).closest('.menu-accordion-wrapper').prev('.search-bar-container')

                $.each(treeViewMenu, function (tvmIndex, tvmItem) {
                    const sideStartPositionBounding = $(tvmItem).prev().get(0).getBoundingClientRect()
                    const sideStartPosition = sideStartPositionBounding.width
                    if (searchBar.length > 0) {
                        const searchBarRect = searchBar.get(0).getBoundingClientRect()
                        $(tvmItem).css({
                            // top: searchBarRect.height + 'px',
                            height: 'calc(100vh - ' + searchBarRect.height + 'px)',
                            left: sideStartPosition + 'px'
                        })
                    } else {
                        $(tvmItem).css({ left: sideStartPosition })
                    }

                    if ($(tvmItem).closest('li').hasClass(className.open)) {
                        treeOpenWidth = treeOpenWidth + sideStartPositionBounding.width
                    }
                })

                if ($(item).closest(selector.treeWrapper).length > 0) {
                    $(item).closest(selector.treeWrapper).prev('.search-bar-container').css({ width: treeOpenWidth + 'px' })
                    $(item).closest(selector.treeWrapper).css({ width: treeOpenWidth + 'px' })
                }
            })
        }

        if (typeof option !== 'undefined' && option.delay) {
            setTimeout(function () {
                initialize();
            }, option.delay)
        } else {
            initialize();
        }
    }
    init();

    // resize event
    let doIt;
    window.onresize = function() {
        clearTimeout(doIt);
        doIt = setTimeout(function() {
            init();
        }, 300);
    };

    return {
        initTreeClick: function () {
            $(document).on('click', selector.tree + ' a', function (event) {
                const tree = $(this).closest(selector.tree)
                const treeViewMenu = $(this).next(selector.treeViewMenu);
                const parentLi = $(this).parent();
                const isOpen = parentLi.hasClass(className.open);
                const isSide = tree.hasClass(className.side)
                const parentLiBounding = parentLi.get(0).getBoundingClientRect()
                const treeViewMenuSideStartPosition = parentLiBounding.x + parentLiBounding.width

                const expand = function (target, parent) {
                    if (option.accordion) {
                        const openMenuLi = parent.siblings(selector.open);
                        const openTree = openMenuLi.children(selector.treeViewMenu);
                        collapse(openTree, openMenuLi);
                    }
                    parent.addClass(className.open);
                    target.css({ display: 'block' });

                    // side panel open
                    if (isSide) {
                        const searchBar = parent.closest('.menu-accordion-wrapper').prev('.search-bar-container')
                        parent.children('.tree-view-menu').css({ left: treeViewMenuSideStartPosition + 'px' })
                        if (searchBar.length > 0) {
                            const searchBarBounding = searchBar.get(0).getBoundingClientRect()

                            parent.children('.tree-view-menu').css({
                                // top: searchBarBounding.height + 'px',
                                height: 'calc(100vh - ' + searchBarBounding.height + 'px)'
                            })
                        }
                        init()
                    }
                };
                const collapse = function (target, parent) {
                    parent.removeClass(className.open);
                    parent.find(selector.treeView).removeClass(className.open).find(selector.treeViewMenu).hide();
                    init()
                };

                if (parentLi.is(selector.disabled)) {
                    return;
                }

                if (!parentLi.is(selector.treeView)) {
                    $.each(tree.find('li'), function (index, item) {
                        $(item).removeClass(selector.active)
                    });
                    parentLi.toggleClass(selector.active)
                    return;
                }

                if ($(this).attr('href') === '#') {
                    event.preventDefault();
                }

                if (isOpen) {
                    collapse(treeViewMenu, parentLi);
                } else {
                    expand(treeViewMenu, parentLi);
                }
            })
        },
        init: function (option) {
            init(option)
        },
        toggleMegaMenu: function (option) {
            $('body').toggleClass('mega-menu-open');
            init(option);
        }
    }
};


/**
 * viewer
 * @returns void
 */
$proto.viewer = {
    constants: {
        class: {
            viewer: '.viewer',
            label: '.label',
            viewerIframe: '.viewer-iframe',
            menuAccordion: '.menu-accordion',
            treeView: '.tree-view',
            treeViewMenu: '.tree-view-menu',
            viewerMetaWrap: '.viewer-meta-wrap',
            viewerMeta: '.viewer-meta',
            priviewUrl: '.more-work-link'
        }
    },
    viewerPage: el => {
        $proto.viewer.updateViewerMeta($(el).data());
        $proto.viewer.updateViewerIframe($(el).data());
        $proto.viewer.updatePriviewUrl($(el).data());
    },
    updateViewerMeta: data => {
        Object.keys(data).forEach(item => $(`td[data-target=${item}]`).html(`${data[item]}` || '-'));
    },
    updateViewerIframe: data => {
        $($proto.viewer.constants.class.viewerIframe).attr('src', `project/${data.project}/${data.pageUrl}`);
    },
    updatePriviewUrl: data => {
        $($proto.viewer.constants.class.priviewUrl).attr('href', `project/${data.project}/${data.pageUrl}`);
    },
    toggleViewerMeta: evt => {
        $(evt.currentTarget).closest($proto.viewer.constants.class.viewerMetaWrap).toggleClass('on');
    }
}




// Ready - Before Mounted, Dom element is created
$(document).ready(function () {
    $proto.treeMenu();
    $proto.treeMenu().initTreeClick();
});

// Load - Mounted, Dom element is created & load resource is done
window.onload = function () {
    console.log('window on load done');
};