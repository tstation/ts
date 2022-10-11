/*
 * Tstation Desktop / v1.0.0
 * Wavers
*/

// JQuery Check
if (typeof window.jQuery === 'undefined') {
    throw new Error('Tstation requires JQuery');
}

// Set Tstation
$.Tstation = {};

/* --------------------
 * - Options -
 * --------------------
 * Set Default Options
 */
$.Tstation.options = {

}

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements
 * functions and plugins as specified by the options above.
 */
$(function () {
    'use strict';

    // set up the object
    init();
    $.Tstation.polyfill.mutationObserver();
    $.Tstation.polyfill.promise();
    $.Tstation.polyfill.customEvent();
    $.Tstation.polyfill.includes();
    $.Tstation.polyfill.remove();
    $.Tstation.polyfill.findIndex();
    $.Tstation.polyfill.repeat();
    $.Tstation.polyfill.startsWith();
    $.Tstation.polyfill.find();
    $.Tstation.popup().init();
});
/* ---------------------------------
 * - Initialize Object -
 * ---------------------------------
 * All functions are implemented below.
 */
function init () {
    'use strict';
    /**
     * Polyfill
     * @returns void
     */
    $.Tstation.polyfill = {
    	find: function() {
    		// https://tc39.github.io/ecma262/#sec-array.prototype.find
    		if (!Array.prototype.find) {
    		  Object.defineProperty(Array.prototype, 'find', {
    		    value: function(predicate) {
    		     // 1. Let O be ? ToObject(this value).
    		      if (this == null) {
    		        throw new TypeError('"this" is null or not defined');
    		      }

    		      var o = Object(this);

    		      // 2. Let len be ? ToLength(? Get(O, "length")).
    		      var len = o.length >>> 0;

    		      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
    		      if (typeof predicate !== 'function') {
    		        throw new TypeError('predicate must be a function');
    		      }

    		      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
    		      var thisArg = arguments[1];

    		      // 5. Let k be 0.
    		      var k = 0;

    		      // 6. Repeat, while k < len
    		      while (k < len) {
    		        // a. Let Pk be ! ToString(k).
    		        // b. Let kValue be ? Get(O, Pk).
    		        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
    		        // d. If testResult is true, return kValue.
    		        var kValue = o[k];
    		        if (predicate.call(thisArg, kValue, k, o)) {
    		          return kValue;
    		        }
    		        // e. Increase k by 1.
    		        k++;
    		      }

    		      // 7. Return undefined.
    		      return undefined;
    		    },
    		    configurable: true,
    		    writable: true
    		  });
    		}
    	},
    	startsWith: function() {
    		if (!String.prototype.startsWith) {
    			String.prototype.startsWith = function(search, pos) {
    				return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    			};
    		}
    	},
    	repeat: function() {
			if (!String.prototype.repeat) {
			  String.prototype.repeat = function(count) {
			    'use strict';
			    if (this == null) {
			      throw new TypeError('can\'t convert ' + this + ' to object');
			    }
			    var str = '' + this;
			    count = +count;
			    if (count != count) {
			      count = 0;
			    }
			    if (count < 0) {
			      throw new RangeError('repeat count must be non-negative');
			    }
			    if (count == Infinity) {
			      throw new RangeError('repeat count must be less than infinity');
			    }
			    count = Math.floor(count);
			    if (str.length == 0 || count == 0) {
			      return '';
			    }
			    // Ensuring count is a 31-bit integer allows us to heavily optimize the
			    // main part. But anyway, most current (August 2014) browsers can't handle
			    // strings 1 << 28 chars or longer, so:
			    if (str.length * count >= 1 << 28) {
			      throw new RangeError('repeat count must not overflow maximum string size');
			    }
			    var maxCount = str.length * count;
			    count = Math.floor(Math.log(count) / Math.log(2));
			    while (count) {
			       str += str;
			       count--;
			    }
			    str += str.substring(0, maxCount - str.length);
			    return str;
			  }
			}
    	},
        mutationObserver: function () {
            if (!window.MutationObserver) {
                window.MutationObserver = (function (undefined) {
                    "use strict";
                    /**
                     * @param {function(Array.<MutationRecord>, MutationObserver)} listener
                     * @constructor
                     */
                    function MutationObserver(listener) {
                        /**
                         * @type {Array.<Object>}
                         * @private
                         */
                        this._watched = [];
                        /** @private */
                        this._listener = listener;
                    }

                    /**
                     * Start a recursive timeout function to check all items being observed for mutations
                     * @type {MutationObserver} observer
                     * @private
                     */
                    function startMutationChecker(observer) {
                        (function check() {
                            var mutations = observer.takeRecords();

                            if (mutations.length) { // fire away
                                // calling the listener with context is not spec but currently consistent with FF and WebKit
                                observer._listener(mutations, observer);
                            }
                            /** @private */
                            observer._timeout = setTimeout(check, MutationObserver._period);
                        })();
                    }

                    /**
                     * Period to check for mutations (~32 times/sec)
                     * @type {number}
                     * @expose
                     */
                    MutationObserver._period = 30 /*ms+runtime*/;

                    /**
                     * Exposed API
                     * @expose
                     * @final
                     */
                    MutationObserver.prototype = {
                        /**
                         * see https://dom.spec.whatwg.org/#dom-mutationobserver-observe
                         * not going to throw here but going to follow the current spec config sets
                         * @param {Node|null} $target
                         * @param {Object|null} config : MutationObserverInit configuration dictionary
                         * @expose
                         * @return undefined
                         */
                        observe: function ($target, config) {
                            /**
                             * Using slightly different names so closure can go ham
                             * @type {!Object} : A custom mutation config
                             */
                            var settings = {
                                attr: !!(config.attributes || config.attributeFilter || config.attributeOldValue),

                                // some browsers enforce that subtree must be set with childList, attributes or characterData.
                                // We don't care as spec doesn't specify this rule.
                                kids: !!config.childList,
                                descendents: !!config.subtree,
                                charData: !!(config.characterData || config.characterDataOldValue)
                            };

                            var watched = this._watched;

                            // remove already observed target element from pool
                            for (var i = 0; i < watched.length; i++) {
                                if (watched[i].tar === $target) watched.splice(i, 1);
                            }

                            if (config.attributeFilter) {
                                /**
                                 * converts to a {key: true} dict for faster lookup
                                 * @type {Object.<String,Boolean>}
                                 */
                                settings.afilter = reduce(config.attributeFilter, function (a, b) {
                                    a[b] = true;
                                    return a;
                                }, {});
                            }

                            watched.push({
                                tar: $target,
                                fn: createMutationSearcher($target, settings)
                            });

                            // reconnect if not connected
                            if (!this._timeout) {
                                startMutationChecker(this);
                            }
                        },

                        /**
                         * Finds mutations since last check and empties the "record queue" i.e. mutations will only be found once
                         * @expose
                         * @return {Array.<MutationRecord>}
                         */
                        takeRecords: function () {
                            var mutations = [];
                            var watched = this._watched;

                            for (var i = 0; i < watched.length; i++) {
                                watched[i].fn(mutations);
                            }

                            return mutations;
                        },

                        /**
                         * @expose
                         * @return undefined
                         */
                        disconnect: function () {
                            this._watched = []; // clear the stuff being observed
                            clearTimeout(this._timeout); // ready for garbage collection
                            /** @private */
                            this._timeout = null;
                        }
                    };

                    /**
                     * Simple MutationRecord pseudoclass. No longer exposing as its not fully compliant
                     * @param {Object} data
                     * @return {Object} a MutationRecord
                     */
                    function MutationRecord(data) {
                        var settings = { // technically these should be on proto so hasOwnProperty will return false for non explicitly props
                            type: null,
                            target: null,
                            addedNodes: [],
                            removedNodes: [],
                            previousSibling: null,
                            nextSibling: null,
                            attributeName: null,
                            attributeNamespace: null,
                            oldValue: null
                        };
                        for (var prop in data) {
                            if (has(settings, prop) && data[prop] !== undefined) settings[prop] = data[prop];
                        }
                        return settings;
                    }

                    /**
                     * Creates a func to find all the mutations
                     *
                     * @param {Node} $target
                     * @param {!Object} config : A custom mutation config
                     */
                    function createMutationSearcher($target, config) {
                        /** type {Elestuct} */
                        var $oldstate = clone($target, config); // create the cloned datastructure

                        /**
                         * consumes array of mutations we can push to
                         *
                         * @param {Array.<MutationRecord>} mutations
                         */
                        return function (mutations) {
                            var olen = mutations.length, dirty;

                            if (config.charData && $target.nodeType === 3 && $target.nodeValue !== $oldstate.charData) {
                                mutations.push(new MutationRecord({
                                    type: "characterData",
                                    target: $target,
                                    oldValue: $oldstate.charData
                                }));
                            }

                            // Alright we check base level changes in attributes... easy
                            if (config.attr && $oldstate.attr) {
                                findAttributeMutations(mutations, $target, $oldstate.attr, config.afilter);
                            }

                            // check childlist or subtree for mutations
                            if (config.kids || config.descendents) {
                                dirty = searchSubtree(mutations, $target, $oldstate, config);
                            }

                            // reclone data structure if theres changes
                            if (dirty || mutations.length !== olen) {
                                /** type {Elestuct} */
                                $oldstate = clone($target, config);
                            }
                        };
                    }

                    /* attributes + attributeFilter helpers */

                    // Check if the environment has the attribute bug (#4) which cause
                    // element.attributes.style to always be null.
                    var hasAttributeBug = document.createElement("i");
                    hasAttributeBug.style.top = 0;
                    hasAttributeBug = hasAttributeBug.attributes.style.value != "null";

                    /**
                     * Gets an attribute value in an environment without attribute bug
                     *
                     * @param {Node} el
                     * @param {Attr} attr
                     * @return {String} an attribute value
                     */
                    function getAttributeSimple(el, attr) {
                        // There is a potential for a warning to occur here if the attribute is a
                        // custom attribute in IE<9 with a custom .toString() method. This is
                        // just a warning and doesn't affect execution (see #21)
                        return attr.value;
                    }

                    /**
                     * Gets an attribute value with special hack for style attribute (see #4)
                     *
                     * @param {Node} el
                     * @param {Attr} attr
                     * @return {String} an attribute value
                     */
                    function getAttributeWithStyleHack(el, attr) {
                        // As with getAttributeSimple there is a potential warning for custom attribtues in IE7.
                        return attr.name !== "style" ? attr.value : el.style.cssText;
                    }

                    var getAttributeValue = hasAttributeBug ? getAttributeSimple : getAttributeWithStyleHack;

                    /**
                     * fast helper to check to see if attributes object of an element has changed
                     * doesnt handle the textnode case
                     *
                     * @param {Array.<MutationRecord>} mutations
                     * @param {Node} $target
                     * @param {Object.<string, string>} $oldstate : Custom attribute clone data structure from clone
                     * @param {Object} filter
                     */
                    function findAttributeMutations(mutations, $target, $oldstate, filter) {
                        var checked = {};
                        var attributes = $target.attributes;
                        var attr;
                        var name;
                        var i = attributes.length;
                        while (i--) {
                            attr = attributes[i];
                            name = attr.name;
                            if (!filter || has(filter, name)) {
                                if (getAttributeValue($target, attr) !== $oldstate[name]) {
                                    // The pushing is redundant but gzips very nicely
                                    mutations.push(MutationRecord({
                                        type: "attributes",
                                        target: $target,
                                        attributeName: name,
                                        oldValue: $oldstate[name],
                                        attributeNamespace: attr.namespaceURI // in ie<8 it incorrectly will return undefined
                                    }));
                                }
                                checked[name] = true;
                            }
                        }
                        for (name in $oldstate) {
                            if (!(checked[name])) {
                                mutations.push(MutationRecord({
                                    target: $target,
                                    type: "attributes",
                                    attributeName: name,
                                    oldValue: $oldstate[name]
                                }));
                            }
                        }
                    }

                    /**
                     * searchSubtree: array of mutations so far, element, element clone, bool
                     * synchronous dfs comparision of two nodes
                     * This function is applied to any observed element with childList or subtree specified
                     * Sorry this is kind of confusing as shit, tried to comment it a bit...
                     * codereview.stackexchange.com/questions/38351 discussion of an earlier version of this func
                     *
                     * @param {Array} mutations
                     * @param {Node} $target
                     * @param {!Object} $oldstate : A custom cloned node from clone()
                     * @param {!Object} config : A custom mutation config
                     */
                    function searchSubtree(mutations, $target, $oldstate, config) {
                        // Track if the tree is dirty and has to be recomputed (#14).
                        var dirty;
                        /*
                         * Helper to identify node rearrangment and stuff...
                         * There is no gaurentee that the same node will be identified for both added and removed nodes
                         * if the positions have been shuffled.
                         * conflicts array will be emptied by end of operation
                         */
                        function resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes) {
                            // the distance between the first conflicting node and the last
                            var distance = conflicts.length - 1;
                            // prevents same conflict being resolved twice consider when two nodes switch places.
                            // only one should be given a mutation event (note -~ is used as a math.ceil shorthand)
                            var counter = -~((distance - numAddedNodes) / 2);
                            var $cur;
                            var oldstruct;
                            var conflict;
                            while ((conflict = conflicts.pop())) {
                                $cur = $kids[conflict.i];
                                oldstruct = $oldkids[conflict.j];

                                // attempt to determine if there was node rearrangement... won't gaurentee all matches
                                // also handles case where added/removed nodes cause nodes to be identified as conflicts
                                if (config.kids && counter && Math.abs(conflict.i - conflict.j) >= distance) {
                                    mutations.push(MutationRecord({
                                        type: "childList",
                                        target: node,
                                        addedNodes: [$cur],
                                        removedNodes: [$cur],
                                        // haha don't rely on this please
                                        nextSibling: $cur.nextSibling,
                                        previousSibling: $cur.previousSibling
                                    }));
                                    counter--; // found conflict
                                }

                                // Alright we found the resorted nodes now check for other types of mutations
                                if (config.attr && oldstruct.attr) findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
                                if (config.charData && $cur.nodeType === 3 && $cur.nodeValue !== oldstruct.charData) {
                                    mutations.push(MutationRecord({
                                        type: "characterData",
                                        target: $cur,
                                        oldValue: oldstruct.charData
                                    }));
                                }
                                // now look @ subtree
                                if (config.descendents) findMutations($cur, oldstruct);
                            }
                        }

                        /**
                         * Main worker. Finds and adds mutations if there are any
                         * @param {Node} node
                         * @param {!Object} old : A cloned data structure using internal clone
                         */
                        function findMutations(node, old) {
                            var $kids = node.childNodes;
                            var $oldkids = old.kids;
                            var klen = $kids.length;
                            // $oldkids will be undefined for text and comment nodes
                            var olen = $oldkids ? $oldkids.length : 0;
                            // if (!olen && !klen) return; // both empty; clearly no changes

                            // we delay the intialization of these for marginal performance in the expected case (actually quite signficant on large subtrees when these would be otherwise unused)
                            // map of checked element of ids to prevent registering the same conflict twice
                            var map;
                            // array of potential conflicts (ie nodes that may have been re arranged)
                            var conflicts;
                            var id; // element id from getElementId helper
                            var idx; // index of a moved or inserted element

                            var oldstruct;
                            // current and old nodes
                            var $cur;
                            var $old;
                            // track the number of added nodes so we can resolve conflicts more accurately
                            var numAddedNodes = 0;

                            // iterate over both old and current child nodes at the same time
                            var i = 0, j = 0;
                            // while there is still anything left in $kids or $oldkids (same as i < $kids.length || j < $oldkids.length;)
                            while (i < klen || j < olen) {
                                // current and old nodes at the indexs
                                $cur = $kids[i];
                                oldstruct = $oldkids[j];
                                $old = oldstruct && oldstruct.node;

                                if ($cur === $old) { // expected case - optimized for this case
                                    // check attributes as specified by config
                                    if (config.attr && oldstruct.attr) /* oldstruct.attr instead of textnode check */findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
                                    // check character data if node is a comment or textNode and it's being observed
                                    if (config.charData && oldstruct.charData !== undefined && $cur.nodeValue !== oldstruct.charData) {
                                        mutations.push(MutationRecord({
                                            type: "characterData",
                                            target: $cur,
                                            oldValue: oldstruct.charData
                                        }));
                                    }

                                    // resolve conflicts; it will be undefined if there are no conflicts - otherwise an array
                                    if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);

                                    // recurse on next level of children. Avoids the recursive call when there are no children left to iterate
                                    if (config.descendents && ($cur.childNodes.length || oldstruct.kids && oldstruct.kids.length)) findMutations($cur, oldstruct);

                                    i++;
                                    j++;
                                } else { // (uncommon case) lookahead until they are the same again or the end of children
                                    dirty = true;
                                    if (!map) { // delayed initalization (big perf benefit)
                                        map = {};
                                        conflicts = [];
                                    }
                                    if ($cur) {
                                        // check id is in the location map otherwise do a indexOf search
                                        if (!(map[id = getElementId($cur)])) { // to prevent double checking
                                            // mark id as found
                                            map[id] = true;
                                            // custom indexOf using comparitor checking oldkids[i].node === $cur
                                            if ((idx = indexOfCustomNode($oldkids, $cur, j)) === -1) {
                                                if (config.kids) {
                                                    mutations.push(MutationRecord({
                                                        type: "childList",
                                                        target: node,
                                                        addedNodes: [$cur], // $cur is a new node
                                                        nextSibling: $cur.nextSibling,
                                                        previousSibling: $cur.previousSibling
                                                    }));
                                                    numAddedNodes++;
                                                }
                                            } else {
                                                conflicts.push({ // add conflict
                                                    i: i,
                                                    j: idx
                                                });
                                            }
                                        }
                                        i++;
                                    }

                                    if ($old &&
                                      // special case: the changes may have been resolved: i and j appear congurent so we can continue using the expected case
                                      $old !== $kids[i]
                                    ) {
                                        if (!(map[id = getElementId($old)])) {
                                            map[id] = true;
                                            if ((idx = indexOf($kids, $old, i)) === -1) {
                                                if (config.kids) {
                                                    mutations.push(MutationRecord({
                                                        type: "childList",
                                                        target: old.node,
                                                        removedNodes: [$old],
                                                        nextSibling: $oldkids[j + 1], // praise no indexoutofbounds exception
                                                        previousSibling: $oldkids[j - 1]
                                                    }));
                                                    numAddedNodes--;
                                                }
                                            } else {
                                                conflicts.push({
                                                    i: idx,
                                                    j: j
                                                });
                                            }
                                        }
                                        j++;
                                    }
                                }// end uncommon case
                            }// end loop

                            // resolve any remaining conflicts
                            if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
                        }
                        findMutations($target, $oldstate);
                        return dirty;
                    }

                    /**
                     * Utility
                     * Cones a element into a custom data structure designed for comparision. https://gist.github.com/megawac/8201012
                     *
                     * @param {Node} $target
                     * @param {!Object} config : A custom mutation config
                     * @return {!Object} : Cloned data structure
                     */
                    function clone($target, config) {
                        var recurse = true; // set true so childList we'll always check the first level
                        return (function copy($target) {
                            var elestruct = {
                                /** @type {Node} */
                                node: $target
                            };

                            // Store current character data of target text or comment node if the config requests
                            // those properties to be observed.
                            if (config.charData && ($target.nodeType === 3 || $target.nodeType === 8)) {
                                elestruct.charData = $target.nodeValue;
                            }
                            // its either a element, comment, doc frag or document node
                            else {
                                // Add attr only if subtree is specified or top level and avoid if
                                // attributes is a document object (#13).
                                if (config.attr && recurse && $target.nodeType === 1) {
                                    /**
                                     * clone live attribute list to an object structure {name: val}
                                     * @type {Object.<string, string>}
                                     */
                                    elestruct.attr = reduce($target.attributes, function (memo, attr) {
                                        if (!config.afilter || config.afilter[attr.name]) {
                                            memo[attr.name] = getAttributeValue($target, attr);
                                        }
                                        return memo;
                                    }, {});
                                }

                                // whether we should iterate the children of $target node
                                if (recurse && ((config.kids || config.charData) || (config.attr && config.descendents))) {
                                    /** @type {Array.<!Object>} : Array of custom clone */
                                    elestruct.kids = map($target.childNodes, copy);
                                }

                                recurse = config.descendents;
                            }
                            return elestruct;
                        })($target);
                    }

                    /**
                     * indexOf an element in a collection of custom nodes
                     *
                     * @param {NodeList} set
                     * @param {!Object} $node : A custom cloned node
                     * @param {number} idx : index to start the loop
                     * @return {number}
                     */
                    function indexOfCustomNode(set, $node, idx) {
                        return indexOf(set, $node, idx, JSCompiler_renameProperty("node"));
                    }

                    // using a non id (eg outerHTML or nodeValue) is extremely naive and will run into issues with nodes that may appear the same like <li></li>
                    var counter = 1; // don't use 0 as id (falsy)
                    /** @const */
                    var expando = "mo_id";

                    /**
                     * Attempt to uniquely id an element for hashing. We could optimize this for legacy browsers but it hopefully wont be called enough to be a concern
                     *
                     * @param {Node} $ele
                     * @return {(string|number)}
                     */
                    function getElementId($ele) {
                        try {
                            return $ele.id || ($ele[expando] = $ele[expando] || counter++);
                        } catch (o_O) { // ie <8 will throw if you set an unknown property on a text node
                            try {
                                return $ele.nodeValue; // naive
                            } catch (shitie) { // when text node is removed: https://gist.github.com/megawac/8355978 :(
                                return counter++;
                            }
                        }
                    }

                    /**
                     * **map** Apply a mapping function to each item of a set
                     * @param {Array|NodeList} set
                     * @param {Function} iterator
                     */
                    function map(set, iterator) {
                        var results = [];
                        for (var index = 0; index < set.length; index++) {
                            results[index] = iterator(set[index], index, set);
                        }
                        return results;
                    }

                    /**
                     * **Reduce** builds up a single result from a list of values
                     * @param {Array|NodeList|NamedNodeMap} set
                     * @param {Function} iterator
                     * @param {*} [memo] Initial value of the memo.
                     */
                    function reduce(set, iterator, memo) {
                        for (var index = 0; index < set.length; index++) {
                            memo = iterator(memo, set[index], index, set);
                        }
                        return memo;
                    }

                    /**
                     * **indexOf** find index of item in collection.
                     * @param {Array|NodeList} set
                     * @param {Object} item
                     * @param {number} idx
                     * @param {string} [prop] Property on set item to compare to item
                     */
                    function indexOf(set, item, idx, prop) {
                        for (/*idx = ~~idx*/; idx < set.length; idx++) {// start idx is always given as this is internal
                            if ((prop ? set[idx][prop] : set[idx]) === item) return idx;
                        }
                        return -1;
                    }

                    /**
                     * @param {Object} obj
                     * @param {(string|number)} prop
                     * @return {boolean}
                     */
                    function has(obj, prop) {
                        return obj[prop] !== undefined; // will be nicely inlined by gcc
                    }

                    // GCC hack see https://stackoverflow.com/a/23202438/1517919
                    function JSCompiler_renameProperty(a) {
                        return a;
                    }

                    return MutationObserver;
                })(void 0);
            }
        },
        promise: function () {
            var myClass = function () {
                this.busy = false;
                this.queue = [];

                this.then = function (fn) {
                    this.queue.push(fn);
                    this.exec();
                    return this;
                }

                // 함수 실행 자 (큐가 남아 있으면 실행합니다.)
                this.exec = function (data) {
                    if (this.busy) return this; // 바쁘니까 다음에
                    var Q = this.queue.shift();
                    var self = this;

                    if (Q) {
                        this.busy = true;

                        // try (Q) {
                        try {
                            // 큐에 함수를 실행 인자는 ok, err, data
                            Q(
                              function (a) {
                                  self.busy = false;
                                  self.exec(a)
                              },
                              function (e) {
                                  self._catch(e);
                              },
                              data
                            );
                        }
                        catch (e) {
                            this._catch(e);
                        }
                    } else {
                        this.busy = false;
                    }
                };

                // 에러가 발생되면 호출
                this.catch = function (fn) {
                    this._catch = fn;
                };
            };

            // 클래스 인스턴스를 반환
            return new myClass();

            // 사용 예시
            // ax.promise()
            //   .then(function (ok, fail, data) {
            //       $.ajax({
            //           url: "/api/v1/connections",
            //           callback: function (res) {
            //               ok(res); // data 로 전달
            //           },
            //           onError: function (res) {
            //               fail(res);
            //           }
            //       });
            //   })
            //   .then(function (ok, fail, data) {
            //       $.ajax({
            //           url: "/api/v1/login",
            //           data: data,
            //           callback: function (res) {
            //               ok(res);
            //           },
            //           onError: function (res) {
            //               fail(res);
            //           }
            //       });
            //   })
            //   .then(function (ok, fail, data) {
            //       console.log("success");
            //   })
            //   .catch(function (res) {
            //       alert(res.message);
            //   });
        },
        customEvent: function () {
            if (typeof window.CustomEvent === 'function') return false;

            function CustomEvent(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }

            CustomEvent.prototype = window.Event.prototype;

            window.CustomEvent = CustomEvent;
        },
        includes: function() {
            if (!String.prototype.includes) {
                String.prototype.includes = function(search, start) {
                    'use strict';
                    if (search instanceof RegExp) {
                        throw TypeError('first argument must not be a RegExp');
                    }
                    if (start === undefined) { start = 0; }
                    return this.indexOf(search, start) !== -1;
                };
            }
            if (!Array.prototype.includes) {
                Object.defineProperty(Array.prototype, 'includes', {
                    value: function(searchElement, fromIndex) {

                        // 1. Let O be ? ToObject(this value).
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }

                        var o = Object(this);

                        // 2. Let len be ? ToLength(? Get(O, "length")).
                        var len = o.length >>> 0;

                        // 3. If len is 0, return false.
                        if (len === 0) {
                            return false;
                        }

                        // 4. Let n be ? ToInteger(fromIndex).
                        //    (If fromIndex is undefined, this step produces the value 0.)
                        var n = fromIndex | 0;

                        // 5. If n ≥ 0, then
                        //  a. Let k be n.
                        // 6. Else n < 0,
                        //  a. Let k be len + n.
                        //  b. If k < 0, let k be 0.
                        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                        // 7. Repeat, while k < len
                        while (k < len) {
                            // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                            // b. If SameValueZero(searchElement, elementK) is true, return true.
                            // c. Increase k by 1.
                            // NOTE: === provides the correct "SameValueZero" comparison needed here.
                            if (o[k] === searchElement) {
                                return true;
                            }
                            k++;
                        }

                        // 8. Return false
                        return false;
                    }
                });
            }

        },
        remove: function () {
            if (!('remove' in Element.prototype)) {
                Element.prototype.remove = function() {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
            }
        },
        findIndex: function () {
            // https://tc39.github.io/ecma262/#sec-array.prototype.findindex
            if (!Array.prototype.findIndex) {
                Object.defineProperty(Array.prototype, 'findIndex', {
                    value: function(predicate) {
                        // 1. Let O be ? ToObject(this value).
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }

                        var o = Object(this);

                        // 2. Let len be ? ToLength(? Get(O, "length")).
                        var len = o.length >>> 0;

                        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                        if (typeof predicate !== 'function') {
                            throw new TypeError('predicate must be a function');
                        }

                        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                        var thisArg = arguments[1];

                        // 5. Let k be 0.
                        var k = 0;

                        // 6. Repeat, while k < len
                        while (k < len) {
                            // a. Let Pk be ! ToString(k).
                            // b. Let kValue be ? Get(O, Pk).
                            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                            // d. If testResult is true, return k.
                            var kValue = o[k];
                            if (predicate.call(thisArg, kValue, k, o)) {
                                return k;
                            }
                            // e. Increase k by 1.
                            k++;
                        }

                        // 7. Return -1.
                        return -1;
                    },
                    configurable: true,
                    writable: true
                });
            }
        }
    }

    /**
     * Validator
     * @returns void
     */
    $.Tstation.validator = {
        // 차량 번호
        carNumber: function (number) {
            var success = false
            var patterns = {
                old: /^[가-힣]{2}[\s]*[0-9]{1,2}[가-힣]{1}[\s]*[0-9]{4}$/,
                new: /^[0-9]{2,3}[\s]*[가-힣]{1}[\s]*[0-9]{4}$/
            }

            $.each(Object.keys(patterns), function (index, item) {
                if (item.test(number)) {
                    success = true
                }
            })

            return success
        },
        // 휴대전화번호
        cellPhoneNumber: function (number) {
            var pattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
            return pattern.test(number)
        },
        // 일반전화번호
        phoneNumber: function (number) {
            var pattern = /^([0-9]{2,3})-?([0-9]{3,4})-?([0-9]{4})$/
            return pattern.test(number)
        },
        // 빈값
        emptySpace: function (string) {
            var pattern = /\s/g
            return pattern.test(string)
        },
        // 날짜 - 2020-03-11
        dateType: function (date) {
            var pattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/
            return pattern.test(date)
        },
        // 월 - 2020-03
        monthType: function (date) {
            var pattern = /^(19|20)\d{2}-(0[1-9]|1[012])$/
            return !pattern.test(date)
        },
        // 특수문자
        specialCharacters: function (characters) {
            var pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/g
            return pattern.test(characters)
        },
        // 이메일
        email: function (email) {
            var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(email)
        },
        // 한글
        kor: function (string) {
            var pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
            return pattern.test(string)
        }
    }

    /**
     * Form Control Tools
     * @returns void
     */
    $.Tstation.formControlTools = function () {
        var className = {
            inputBox: 'input-box',
            tools: 'tools'
        }
        var inputBoxs = document.getElementsByClassName(className.inputBox);
        var i;
        for (i = 0; i < inputBoxs.length; i++) {
            var inputBox = inputBoxs[i];
            var tools = inputBox.nextElementSibling;
            if (typeof tools !== 'undefined' && tools !== null && tools.classList.contains(className.tools)) {
                if (tools.getBoundingClientRect().width !== 0) {
                    inputBox.style.paddingRight = tools.getBoundingClientRect().width + 'px'
                }
            }
        };

        $(document).on('propertychange change keyup paste input', '.' + className.inputBox, function () {
            var tools = $(this).closest('.input-group').find('.' + className.tools)
            var clear = tools.children('.clear')
            var val = $(this).val();

            val.length > 0 ? clear.addClass('on') : clear.removeClass('on')
        });

        $(document).on('click', '.input-group .tools .clear', function () {
            var inputGroup = $(this).closest('.input-group');
            var input = inputGroup.find('.input-box');

            if (input.length > 0) {
                input.val('');
                $(this).removeClass('on');
                input.focus();
            }
        });

        /*$(document).on('keyup', selector.inputBox, function () {
            var inputGroup = $(this).closest(selector.inputGroup)
            var inputGroupTools = inputGroup.find(selector.inputGroupTools)

            if (inputGroupTools.length > 0) {
                var inputGroupToolsWidth = Number(inputGroupTools.css('right').replace('px', '')) + inputGroupTools.get(0).getBoundingClientRect().width + 4

                if (typeof inputGroupTools.get(0).getBoundingClientRect() !== 'undefined' && inputGroupTools.get(0).getBoundingClientRect().width > 0) {
                    $(this).css('padding-right', inputGroupToolsWidth + 'px')
                }
            }
        });*/
    };

    /**
     * Tstation Family Site selector
     * @returns void
     */
    $.Tstation.familySiteSelector = function () {
        // bind change event to select
        $('#family-site').on('change', function () {
            var url = $(this).val();
            if (url) {
                window.location.href = url;
            }
            return false;
        });
    };

    /**
     * Form Control Number
     * @returns void
     * Load after Dom Element created
     * Required Swiper plugins
     */
    $.Tstation.formControlNumber = function () {
        var selector = {
            formControlNumber: '.form-control-number',
            control: '.control',
            controlDecrease: '.control-decrease',
            controlIncrease: '.control-increase',
            count: '.count'
        }
        var className = {
            controlDecrease: 'control-decrease',
            controlIncrease: 'control-increase',
            disabled: 'disabled'
        }
        var updateCount = function (target, count) {
            target.text(count)
        }
        var updateControlStatus = function (parent, value, options) {
            // decrease
            if (Number(value) <= Number(options.min)) {
                parent.find(selector.controlDecrease).addClass(className.disabled)
            } else {
                parent.find(selector.controlDecrease).removeClass(className.disabled)
            }

            // increase
            if (Number(value) >= Number(options.max)) {
                parent.find(selector.controlIncrease).addClass(className.disabled)
            } else {
                parent.find(selector.controlIncrease).removeClass(className.disabled)
            }
        };

        // init
        var initTarget = $(selector.formControlNumber + ' ' + 'input[type=number]')
        $.each(initTarget, function (index, item) {
            if ($(item) && $(item).val()) {
                var formControlNumber = $(this).closest(selector.formControlNumber)
                var options = {
                    min: $(item).attr('min'),
                    max: $(item).attr('max'),
                    step: $(item).attr('step')
                }
                // set disabled class
                if ($(item).attr('disabled')) {
                    $(item).closest(selector.formControlNumber).addClass(className.disabled);
                }

                // control init
                updateControlStatus(formControlNumber, Number($(item).val()), options)

                // count init
                updateCount($(item).closest(selector.formControlNumber).find(selector.count), $(item).val())
            }
        })


        // control click
        $(document).on('click', selector.formControlNumber + ' ' + selector.control, function () {

            var formControlNumber = $(this).closest(selector.formControlNumber)
            var input = formControlNumber.find('input[type=number]')
            var count = formControlNumber.find(selector.count)
            var value = input.val()
            var options = {
                min: input.attr('min'),
                max: input.attr('max'),
                step: input.attr('step')
            }
            var step = options.step ? options.step : 1

            // Increase Decrease input value
            if ($(this).hasClass(className.controlDecrease)) {
                if (typeof options.min !== 'undefined' && (Number(options.min) >= value)) {
                    return false;
                } else {
                    input.val(Number(value) - Number(step))
                }
            } else if ($(this).hasClass(className.controlIncrease)) {
                if (typeof options.max !== 'undefined' && (Number(options.max) <= value)) {
                    return false;
                } else {
                    input.val(Number(value) + Number(step))
                }
            }

            // update control disabled
            updateControlStatus(formControlNumber, input.val(), options);

            // update count
            updateCount(count, input.val());
        });
    };

    /**
     * Tab
     * @returns void
     * Load after Dom Element created
     */
    $.Tstation.tab = {
        constants: {
            selector: {
                tabItem: '.tab-item',
                tabContents: '.tab-contents',
                indicator: '.indicator',
                onLayer: '.on-layer'
            },
            className: { on: 'on' },
            customAttr: { tabContents: 'data-tab-contents' }
        },
        methods: {
            handleTabContentChange: function (target) {
                var constants = $.Tstation.tab.constants
                var tabContents = $(constants.selector.tabContents);
                if (tabContents.length > 0) {
                    tabContents.removeClass(constants.className.on);
                    $(constants.selector.tabContents + '[' + constants.customAttr.tabContents + '=' + target + ']').addClass(constants.className.on);
                }
            },
            handleTabItemChange: function (condition) {
                var constants = $.Tstation.tab.constants
                var parent = condition.el.closest(constants.selector.tabItem);
                var target = condition.el.data().tabEvent;
                var setIndicator = function () {
                    $(parent.find(constants.selector.indicator), parent).css({
                        width: condition.el.outerWidth(),
                        left: condition.el.position().left
                    });
                    condition.el.siblings().removeClass(constants.className.on);
                    condition.el.addClass(constants.className.on);
                }

                // create indicator
                if(parent.find(constants.selector.indicator).length === 0) {
                    parent.append('<div class="' + constants.selector.indicator.replace('.', '') +'"></div>')
                }

                // set position style
                condition.isInit ? setTimeout(function () { setIndicator(); }, 200) : setIndicator();

                // call tab contents changer
                if (typeof target !== 'undefined') {
                    $.Tstation.tab.methods.handleTabContentChange(target);
                }
            }
        },
        addEvent: function () {
            var selector = $.Tstation.tab.constants.selector
            $(document).on('click', selector.tabItem + '> a' , function (e) {
                if ($(this).closest($.Tstation.tab.constants.selector.tabItem).hasClass($.Tstation.tab.constants.selector.onLayer.replace('.', '')) || $(this).closest($.Tstation.tab.constants.selector.tabItem).hasClass('disabled')) {
                    if ($(this).closest($.Tstation.tab.constants.selector.tabItem).hasClass('hash')) return
                    e.preventDefault();
                }
                $.Tstation.tab.methods.handleTabItemChange({ el: $(this), isInit: false });
            });
        },
        init: function () {
            var constants = $.Tstation.tab.constants
            if ($(constants.selector.tabItem).length > 0) {
                $.each($(constants.selector.tabItem), function (index, item) {
                    var activeTab = $(item).find('a.on');
                    if (activeTab.length > 0) {
                        $.Tstation.tab.methods.handleTabItemChange({ el: activeTab, isInit: true });
                    }
                })
            }
        }
    }

    /**
     * Tabs
     * @returns void
     * Load after Dom Element created
     */
    $.Tstation.tabs = {
        constants: {
            selector: {
                tabs: '.tabs',
                tabsInner: '.tabs-inner',
                tabsItem: '.tabs-item',
                tabsContents: '.tabs-contents',
                indicator: '.indicator'
            },
            className: {
                on: 'on'
            },
            dataAttr: {
                tabs: 'tabs',
                tabsEvents: 'tabsEvents',
                tabsContents: 'data-tabs-contents'
            }
        },
        methods: {
            handleContentChange: function (target) {
                var constants = $.Tstation.tabs.constants
                var tabsContents = $(constants.selector.tabsContents);
                if (tabsContents.length > 0) {
                    tabsContents.removeClass(constants.className.on);
                    $(constants.selector.tabsContents + '[' + constants.dataAttr.tabsContents + '=' + target + ']')
                      .addClass(constants.className.on);
                }
            },
            handleTabsChange: function (condition) {
                var constants = $.Tstation.tabs.constants
                var parent = condition.el.closest(constants.selector.tabs)
                var target = condition.el.data()[constants.dataAttr.tabsEvents]
                var setIndicator = function () {
                    $(parent.find(constants.selector.indicator), parent).css({
                        width: condition.el.outerWidth(),
                        left: condition.el.position().left
                    })
                    parent.find(constants.selector.tabsItem).removeClass(constants.className.on)
                    condition.el.addClass(constants.className.on)
                }

                // create indicator
                if (parent.find(constants.selector.indicator).length === 0) {
                    parent.find(constants.selector.tabsInner)
                      .append('<div class="' + constants.selector.indicator.replace('.', '') +'"></div>')
                }

                // set style
                setIndicator();

                // change tabs contents
                $.Tstation.tabs.methods.handleContentChange(target)
            },
        },
        addEvent: function () {
            var selector = $.Tstation.tabs.constants.selector
            $(document).on('click', selector.tabs + ' ' + selector.tabsItem , function () {
                $.Tstation.tabs.methods.handleTabsChange({ el: $(this), isInit: false });
            });
        },
        init: function (el) {
            var constants = $.Tstation.tabs.constants

            if ($(constants.selector.tabs).length > 0) {
                $.each($(constants.selector.tabs), function (index, item) {
                    var activeTab = $(item).find(constants.selector.tabsItem + '.' + constants.className.on);
                    if (activeTab.length > 0) {
                        $.Tstation.tabs.methods.handleTabsChange({ el: activeTab, isInit: true });
                    }
                })
            }
        }
    }

    /**
     * ScrollLock
     * @returns void
     */
    $.Tstation.scrollLock = {
        constants: {
            className: {
                scrollLock: 'scroll-lock'
            }
        },
        lock: function () {
            $('body').addClass($.Tstation.scrollLock.constants.className.scrollLock)
        },
        unLock: function () {
            $('body').removeClass($.Tstation.scrollLock.constants.className.scrollLock)
        }
    }

    /**
     * Popup
     * @returns void
     */
    $.Tstation.popup = function () {
        var selector = {
            modalItem: '.modal-item',
            dim: '.dim',
            modalPanel: '.modal-panel',
            modalHeader: '.modal-header',
            btnPopupClose: '.btn-popup-close',
            modalAction: '.modal-action',
            modalBody: '.modal-body',
            modalScroller: '.modal-scroller',
            container: '.container',
            instance: '.instance'
        }
        var className = {
            on: 'on',
            sizeS: 'size-s',
            sizeM: 'size-m',
            sizeL: 'size-l',
            pdH: 'pd-h-',
            pdV: 'pd-v-',
            pdT: 'pd-t-',
            pdB: 'pd-b-',
            pdL: 'pd-l-',
            pdR: 'pd-r-',
            white: 'white',
            btnOl: 'btn-ol',
            noBoundary: 'no-boundary'
        }
        var customAttr = { ref: 'ref' }
        var template = function (condition, contents) {
            var ref = ' data-' + customAttr.ref + '="' + condition.ref +'"'
            var dimWhite = condition.dimWhite ? 'dim white' : 'dim'
            var minHeight = condition.minHeight ? 'h-size-m' : ''
            var modalSize = function (size) {
                var value = ''
                switch (size) {
                    case 'SMALL':
                        value = className.sizeS
                        break
                    case 'LARGE':
                        value = className.sizeL
                        break
                    case 'MEDIUM':
                    default:
                        value = className.sizeM
                        break
                }
                return value
            }
            var modalHeader = function (title, tools) {
                var toolsTemplate = function () {
                    var toolsContainer = function (items) {
                        return '<div class="tools">' + items  + '</div>'
                    }
                    var toolsItemTemplate = function () {
                        var returnTemplate = ''
                        var itemTemplate = function (item) {
                            return '<button type="button" class="tools-item" onclick="' + item.method + '">\n' +
                              '<span class="icon"><span class="line-icons ' + item.icon + ' size-16"></span></span>\n' +
                              '<span class="label">' + item.label + '</span>\n' +
                              '</button>'
                        }

                        $.each(tools, function (index, item) {
                            returnTemplate = returnTemplate.concat(itemTemplate(item))
                        })

                        return returnTemplate
                    }

                    return (typeof tools !== 'undefined' && tools.length > 0) ? toolsContainer(toolsItemTemplate()) : '';
                }
                var header = '<div class="modal-header">\n' +
                  '             <h3>' + title + '</h3>\n' +
                                toolsTemplate() +
                  '             <button type="button" class="btn-item btn-l btn-neutral round btn-inv min-w btn-popup-close">\n' +
                  '                 <span class="line-icons close size-30"></span>\n' +
                  '             </button>\n' +
                  '           </div>\n'

                return title ? header : ''
            }
            var modalAction = function (modalAction) {
                if (typeof modalAction === 'undefined') { return '' }

                var noBoundary = modalAction.isNoBoundary ? className.noBoundary : ''
                var button = function () {
                    var buttonTemplate = function (button) {
                        var buttonNegative = button.negative ? className.btnOl : ''
                        return '<li>\n' +
                          '             <button type="button" class="btn-item btn-neutral ' + buttonNegative + ' round full-w" onclick="' + button.action + '">\n' +
                          '                 <span class="label-txt">' + button.label + '</span>\n' +
                          '             </button>\n' +
                          '           </li>'
                    }
                    var pushHtml = ''

                    $.each(modalAction.buttons, function (index, item) {
                        pushHtml = pushHtml.concat(buttonTemplate(item))
                    })

                    return pushHtml
                }
                var actionTemplate = '<div class="modal-action ' + noBoundary + '">\n' +
                  '                        <ul class="list-size-equal">\n' +
                  button() +
                  '                        </ul>\n' +
                  '                    </div>\n'

                return (typeof modalAction.buttons !== 'undefined' && modalAction.buttons.length > 0) ? actionTemplate : '\n'
            }
            var modalContentsPd = function (padding) {
                var pdChecker = function (key, value) {
                    switch (key) {
                        case 'horizon':
                            return className.pdH + value + 'u';
                        case 'vertical':
                            return className.pdV + value + 'u';
                        case 'top':
                            return className.pdT + value + 'u';
                        case 'right':
                            return className.pdR + value + 'u';
                        case 'bottom':
                            return className.pdB + value + 'u';
                        case 'left':
                            return className.pdL + value + 'u';
                        default:
                            return ''
                    }
                };

                var pdClass = ''
                $.each(padding, function (key, value) {
                    if (value > 0) {
                        pdClass = pdClass.concat(' ' + pdChecker(key, value))
                    }
                });

                return pdClass;
            }

            return '<div class="modal-item instance"' + ref + '>\n' +
              '            <div class="' + dimWhite +'"></div>\n' +
              '            <div class="middler">\n' +
              '                <div class="modal-pannel ' + modalSize(condition.modalSize) + '">\n' +
                                    modalHeader(condition.title, condition.tools) +
                                    modalAction(condition.modalAction) +
              '                    <div class="modal-body">\n' +
              '                        <div class="modal-scroller">\n' +
              '                            <div class="container' + modalContentsPd(condition.modalContentsPd) + ' ' + minHeight + '">\n' +
                                                contents +
              '                            </div>\n' +
              '                        </div>\n' +
              '                    </div>\n' +
              '                </div>\n' +
              '            </div>\n' +
              '        </div>'
        }

        return {
            init: function () {
                $(document).on('click', selector.modalItem, function (e) {
                    if ($(e.target).closest(selector.instance).length === 0) return
                    if ($(e.target).closest(selector.dim).length > 0 || $(e.target).closest(selector.btnPopupClose).length > 0) {
                        var modalItem = $(e.target).closest(selector.modalItem)
                        modalItem.removeClass(className.on)
                        setTimeout(function () {
                            modalItem.remove();
                        }, 200)
                    }
                })
            },
            open: function (condition) {
                var testCondition = {
                    ref: 'modal-ref-1', // 모달 아이디
                    title: '모달 팝업 타이틀', // 모달 타이틀
                    requestUrl: '', // 모달 컨텐츠 정보 GET: html
                    contents: '<p class=\'pd-v-5u txt-center\'>비동기식 Html 요청하지 않고 html string 추가</p>',
                    dimWhite: false, // dim 배경이 화이트인가
                    minHeight: false, // min height 추가
                    modalContentsPd: {
                        horizon: 8,
                        vertical: 8,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    modalSize: 'LARGE', // SMALL, MEDIUM, LARGE - 모달 사이즈
                    modalAction: {
                        isNoBoundary: true, // 팝업 버텀 액선 바 스타일
                        buttons: [
                            {
                                label: '취소', // 버튼 라벨
                                negative: true, // 버튼 중요도 - true 낮음, false 높음
                                action: function () {
                                    $.Tstation.popup().close('modal-ref-1')
                                }
                            },
                            {
                                label: '확인',
                                negative: false,
                                action: function () {
                                    alert('등록한 액션을 스트링으로 추가하세요.')
                                }
                            }
                        ]
                    },
                    onOpen: function () {
                        console.log('팝업이 열리면 파이어 합니다.')
                    },
                    onClose: function () {
                        console.log('팝업이 닫히면 파이어 합니다.')
                    }
                }
                var createPopup = function (params, contents) {
                    var popupString = template(params, contents)
                    var popupHtml = $.parseHTML(popupString, document, true)
                    var onOpen = function () {
                        // scroll lock
                        $.Tstation.scrollLock.lock();
                        // on open fire
                        if (typeof params.onOpen !== 'undefined' && typeof params.onOpen === 'function') {
                            params.onOpen();
                        }
                    };
                    var onClose =function () {
                        // 1. set target
                        var target = popupHtml[0];
                        // 2. set instance observer
                        var observer = new MutationObserver(function(mutations) {
                            if (!mutations[0].target.classList.contains('on')) {
                                // scroll unlock
                                if ($(selector.modalItem + '.' + className.on).length === 0) {
                                    $.Tstation.scrollLock.unLock();
                                }
                                // on close fire
                                if (typeof params.onClose !== 'undefined' && typeof params.onClose === 'function') {
                                    params.onClose();
                                }
                            }
                        });
                        // 3. set options
                        var config = { attributes: true, childList: true, characterData: true };
                        // 4. bind
                        observer.observe(target, config);
                    }

                    // modal action check
                    if (typeof params.modalAction !== 'undefined' && typeof params.modalAction.buttons !== 'undefined' && params.modalAction.buttons.length > 0) {
                        var replacer =  function (el) {
                            $(popupHtml).find(selector.modalAction + '>' + 'ul').append(el)
                        }
                        var createButtons = function (button) {
                            var buttonNegative = button.negative ? className.btnOl : ''
                            var elLi = document.createElement('li')
                            var elButton = document.createElement('button')
                            var elSpanTxt = document.createTextNode(button.label)
                            var elSpan = document.createElement('span')

                            // set span
                            elSpan.classList.add('label-txt')
                            elSpan.appendChild(elSpanTxt)

                            // set button - ie
                            elButton.classList.add('btn-item')
                            elButton.classList.add('btn-neutral')
                            elButton.classList.add('round')
                            elButton.classList.add('full-w')
                            if (buttonNegative) {
                                elButton.classList.add(buttonNegative)
                            }

                            if (typeof button.action !== 'undefined' && typeof button.action === 'string') {
                                elButton.onclick = function () {
                                    eval(button.action)
                                }
                            } else if (typeof button.action !== 'undefined' && typeof button.action === 'function') {
                                elButton.onclick = function () {
                                    button.action();
                                    return false;
                                }
                            }

                            // append
                            elButton.appendChild(elSpan)
                            elLi.appendChild(elButton)

                            return elLi
                        }

                        $(popupHtml).find(selector.modalAction + '>' + 'ul').empty();
                        $.each(params.modalAction.buttons, function (index, item) {
                            replacer(createButtons(item));
                        })
                    }
                    $(document.body).append(popupHtml);
                    setTimeout(function () {
                        $(selector.modalItem + '[data-' + customAttr.ref + '="' + params.ref + '"]').addClass(className.on);
                        onOpen();
                        onClose();
                    }, 10);

                    // tab init
                    $.Tstation.tab.init();
                    $.Tstation.tabs.init();
                }

                if (typeof condition.requestUrl !== 'undefined' && condition.requestUrl.length > 0) {
                    $.ajax({
                        url: condition.requestUrl,
                        dataType: 'html',
                        success: function (data) {
                            createPopup(condition, data)
                        },
                        fail: function (e) {
                            throw new Error('Call Async Popup Request Error')
                        }
                    });
                } else {
                    createPopup(condition, condition.contents)
                }
            },
            close: function (ref) {
                var target = ref ? $(selector.modalItem + '[data-' + customAttr.ref + '="' + ref + '"]') : $(selector.modalItem)
                target.removeClass(className.on);
                setTimeout(function () {
                    target.remove();
                }, 200)
            },
            toggleByClass: function (target) {
                if ($(target).length === 0) return

                // 1. open target
                $.Tstation.scrollLock.lock();
                if (!$(target).hasClass(className.on)) {
                    $(target).addClass(className.on);
                }

                // 2. scroll lock trigger
                // 2-1. set target
                var nodeTarget;
                if (target.indexOf('#') !== -1) {
                    nodeTarget = document.getElementById(target.replace('#', ''));
                } else if (target.indexOf('.') !== -1) {
                    nodeTarget = document.getElementsByClassName(target.replace('.', ''));
                }

                // 2-2. set instance observer
                var observer = new MutationObserver(function(mutations) {
                    if (!mutations[0].target.classList.contains(className.on)) {
                        // scroll unlock
                        if ($(selector.modalItem + '.' + className.on).length === 0) {
                            $.Tstation.scrollLock.unLock();
                        }
                        this.disconnect();
                    }
                });
                // 2-3. set options
                var config = { attributes: true, childList: true, characterData: true };
                // 2-4. bind
                observer.observe(nodeTarget, config);

                // set listener
                $(target).on('click', function (e) {
                    if ($(e.target).closest(selector.dim).length > 0 || $(e.target).closest(selector.btnPopupClose).length > 0) {
                        $(e.target).closest(selector.modalItem).removeClass(className.on);
                    }
                });
            }
        }
    };

    /**
     * Loading
     * @returns void
     */
    $.Tstation.loading = {
        constants: {
            selector: {
                loading: '#loading-indicator',
                modalItem: '.modal-item',
            },
            className: { on: 'on' },
            template: '<div id="loading-indicator">\n' +
              '<div class="dim"></div>\n' +
              '    <div class="loader">\n' +
              '        <span class="loader-image"></span>\n' +
              '        <p class="loader-description">잠시만 기다려 주세요.</p>\n' +
              '    </div>\n' +
              '</div>'
        },
        start: function () {
            var self = this
            $.Tstation.scrollLock.lock();
            if (!document.querySelector(self.constants.selector.loading)) {
                $(document.body).append(this.constants.template);
            }
            setTimeout(function () {
                $(self.constants.selector.loading).addClass('on');
            }, 10);
        },
        end: function () {
            var self = this
            if ($(this.constants.selector.modalItem + '.' + this.constants.className.on).length === 0) {
                $.Tstation.scrollLock.unLock();
            }
            $(this.constants.selector.loading).removeClass('on');
            setTimeout(function () {
                document.querySelector(self.constants.selector.loading).remove();
            }, 300);
        }
    }

    /**
     * Action Sheet
     * @returns void
     */
    $.Tstation.actionSheet = {
        constants: {
            selector: {
                actionSheet: '.action-sheet',
                dim: '.dim',
                actions: '.actions'
            },
            className: {
                on: 'on',
                btnOl: 'btn-ol'
            },
            customAttr: { ref: 'ref' }
        },
        init: function () {
            var constants = $.Tstation.actionSheet.constants
            $(document).on('click', constants.selector.actionSheet, function (e) {
                var actionSheet = $(e.target).closest(constants.selector.actionSheet)

                if ($(e.target).closest(constants.selector.dim).length > 0) {
                    actionSheet.removeClass(constants.className.on)
                    setTimeout(function () {
                        actionSheet.remove()
                    }, 200)
                }
            })
        },
        open: function (options) {
            // var sampleOptions = {
            //     ref: 'action-sheet-1', // 액션 시트 아이디
            //     actions: [
            //         {
            //             icon: 'call', // 아이콘
            //             label: '031-781-3345', // 버튼 라벨
            //             negative: false, // 버튼 중요도 - true 낮음, false 높음
            //             action: function () {
            //                 window.location.href = 'tel:031-781-3345'
            //             }
            //         },
            //         {
            //             icon: '', // 아이콘
            //             label: '취소', // 버튼 라벨
            //             negative: true, // 버튼 중요도 - true 낮음, false 높음
            //             action: function () {
            //                 $.Tstation.actionSheet.close('action-sheet-1');
            //             }
            //         }
            //     ]
            // }

            var constants = $.Tstation.actionSheet.constants
            var actionSheet = document.createElement('div')
            var dim = document.createElement('div')
            var actions = document.createElement('div')
            var createAction = function (button) {
                var action = document.createElement('button')
                var labelText = document.createTextNode(button.label)
                var label = document.createElement('span')

                // set button
                if (button.negative) {
                    action.classList.add('btn-item', 'btn-primary', 'btn-ol', 'round', 'full-w')
                } else {
                    action.classList.add('btn-item', 'btn-neutral', 'btn-ol', 'round', 'full-w')
                }
                if (typeof button.action !== 'undefined' && typeof button.action === 'string') {
                    action.onclick = function () {
                        eval(button.action)
                    }
                } else if (typeof button.action !== 'undefined' && typeof button.action === 'function') {
                    action.onclick = function () {
                        button.action();
                        return false;
                    }
                }

                // set icon
                if (button.icon) {
                    var icon = document.createElement('span')
                    icon.classList.add('line-icons', 'size-20', button.icon)
                    action.appendChild(icon)
                }

                // set label
                label.classList.add('label-txt')
                label.appendChild(labelText)
                action.appendChild(label)

                return action
            }

            actionSheet.classList.add(constants.selector.actionSheet.replace('.', ''))
            actionSheet.setAttribute('data-' + constants.customAttr.ref, options.ref);
            dim.classList.add(constants.selector.dim.replace('.', ''))
            actions.classList.add(constants.selector.actions.replace('.', ''))
            $.each(options.actions, function (index, item) {
                actions.appendChild(createAction(item))
            });

            actionSheet.appendChild(dim)
            actionSheet.appendChild(actions)
            $(document.body).append(actionSheet);

            setTimeout(function () {
                $(constants.selector.actionSheet + '[data-' + constants.customAttr.ref + '="' + options.ref + '"]').addClass(constants.className.on);
            }, 10)
        },
        close: function (ref) {
            var constants = $.Tstation.actionSheet.constants
            var target = ref ? $(constants.selector.actionSheet + '[data-' + constants.customAttr.ref + '="' + ref + '"]') : $(constants.selector.actionSheet)
            target.removeClass(constants.className.on);
            setTimeout(function () {
                target.remove();
            }, 200)
        }
    }

    /**
     * Read Local Html
     * @returns void
     */
    $.Tstation.readLocalHtml = function (file) {
        var html = null
        var rawFile = new XMLHttpRequest();
        rawFile.open('GET', file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    html = rawFile.responseText;
                }
            }
        }
        rawFile.send(null);

        return html
    };

    /**
     * ToggleView
     * @returns void
     */
    $.Tstation.toggleView = function (target) {
        $(target).css('display', $(target).css('display') === 'none' ? 'block' : 'none')
    }

    /**
     * CopyToClipboard
     * @returns void
     */
    $.Tstation.copyToClipboard = function (messages) {
        var el = document.createElement('textarea')
        el.value = messages.message
        el.setAttribute('readonly', '')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        var selected =
          document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        if (selected) {
            document.getSelection().removeAllRanges()
            document.getSelection().addRange(selected)
        }

        alert(messages.completeMessage ? messages.completeMessage : '클립보드에 복사되었습니다.')
    }

    /**
     * ProductBuyProcessBar
     * @returns void
     */
    $.Tstation.productBuyProcessBar = {
        constants: {
            selector: {
                footer: 'footer',
                productBuyProcessBarWrapper: '.product-buy-process-bar-wrapper',
                productBuyProcessBar: '.product-buy-process-bar'
            }
        },
        methods: {
            floating: function () {
                var constants = $.Tstation.productBuyProcessBar.constants
                var floaterWrapper = document.querySelector(constants.selector.productBuyProcessBarWrapper)
                var floater = document.querySelector(constants.selector.productBuyProcessBar)
                var footer = document.getElementById(constants.selector.footer)

                // required element check
                if (!(typeof floater !== 'undefined' && floater !== null) || !(typeof footer !== 'undefined' && footer !== null)) {
                    return
                }

                // floater position change
                var floaterPositionChanger = function () {
                    var footerTop = Math.floor(footer.getBoundingClientRect().top)
                    var footerMarginTop = Number(window.getComputedStyle(footer).getPropertyValue('margin-top').replace('px', ''))
                    floater.style.position = (window.innerHeight <= footerTop - footerMarginTop) ? 'fixed' : 'absolute'
                }

                // 0. footer margin change
                footer.style.marginTop = '0'

                // 1. floater parent set height
                floaterWrapper.style.height = floater.getBoundingClientRect().height + 'px'

                // 2. init
                floaterPositionChanger();

                // 3. add event listener
                $(window).on('scroll', function () { floaterPositionChanger(); });
            }
        }
    }

    /**
     * Image Error
     * @returns void
     */
    $.Tstation.imageError = function (condition) {
        if (typeof condition.el === 'undefined' && condition.el === null) {
            throw new Error('required element')
        }
        condition.url ? condition.el.src = condition.url : condition.el.style.display = 'none'
    }


    /**
     * Call CS
     * 1:1 문의 호출
     * 메서드 호출 시점은 window.onload 이후에만 가능(cdn 방식의 외부 라이브러리를 사용하고 있음.)
     * @returns void
     */
    $.Tstation.callCs = function () {
        if (typeof zE !== 'function') {
            $.Tstation.popup().open({
                ref: 'cs-error',
                requestUrl: '', // 비동기 방식으로 컨텐츠 영역을 받아올때
                contents: '<p class="txt-center pd-t-4u txt-16">\n' +
                  '<span class="line-icons error-circle size-48 txt-neutral3 mg-b-2u"></span><br />\n' +
                  '1:1 문의를 준비중 입니다. 잠시 후 다시 시도해 주세요.\n' +
                  '</p>', // 팝업을 바로 띄우고 싶을때
                dimWhite: false,
                modalContentsPd: { // contents 영역의 padding 값 조절 해당 숫자의 * 4px 예: top 8 > top 32px
                    horizon: 8,
                    vertical: 8,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                modalAction: {
                    isNoBoundary: false,
                    buttons: [
                        {
                            label: '확인',
                            negative: false,
                            action: function () {
                                $.Tstation.popup().close('cs-error')
                            }
                        }
                    ]
                }
            });
            return;
        }
        zE('webWidget', 'show');
        zE('webWidget', 'open');
        zE('webWidget:on', 'close',function(){
            zE('webWidget', 'hide');
        });
    }
};

/**
 * myDrivingStyle
 * required rangeslider.js
 * https://github.com/andreruffert/rangeslider.js
 * @returns void
 */
$.Tstation.myDrivingStyle = {
    init: function (element, condition) {
        var stickyBreak = []
        var slideTo = function (compareNumbers, count) {
            compareNumbers.sort(function (a, b) {
                return Math.abs(count - a) - Math.abs(count - b);
            });
            return compareNumbers[0];
        }
        var dispatchFireValue = 0

        // filtering
        $.each(condition, function (index, item) {
            if (stickyBreak.indexOf(item.position.start) === -1) {
                stickyBreak.push(item.position.start)
            }
            if (stickyBreak.indexOf(item.position.end) === -1) {
                stickyBreak.push(item.position.end)
            }
            if (index === condition.length - 1) {
                stickyBreak.push(100)
            }
        });

        $(element).rangeslider({
            // Feature detection the default is `true`.
            // Set this to `false` if you want to use
            // the polyfill also in Browsers which support
            // the native <input type="range"> element.
            polyfill: false,

            // Default CSS classes
            rangeClass: 'range-slider-component on-all',
            disabledClass: 'range-slider-component-disabled',
            horizontalClass: 'range-slider-component-horizon',
            verticalClass: 'range-slider-component-vertical',
            fillClass: 'range-slider-component-fill',
            handleClass: 'range-slider-component-handle',

            // Callback function
            onInit: function () {
                var _this = this.$range
                var creatOverlapEl = function (range, el) {
                    range.prepend(el.template);
                    $(el.target).css('left', el.position[el.isGap ? 'start' : 'end'] + '%');
                    $(el.target).css('width', el.isGap ? (el.position.end - el.position.start + '%') : '1px');
                }

                $.each(condition, function (index, item) {
                    creatOverlapEl(_this, item);
                });
            },

            // Callback function
            onSlide: function (position, value) {
                (value >= 0 && value < condition[0].position.end) ? this.$range.addClass('on-all') : this.$range.removeClass('on-all')
            },

            // Callback function
            onSlideEnd: function (position, value) {
                var _this = this.$range
                var slideToPosition = slideTo(stickyBreak, value)


                // slider animation
                _this.addClass('transition-start');
                $('#find-driving-style').val(slideToPosition).change();
                setTimeout(function () {
                    _this.removeClass('transition-start');
                }, 200);

                // fire to event listener
                if (dispatchFireValue !== slideToPosition) {
                    dispatchFireValue = slideToPosition
                    var event = new CustomEvent('myDrivingStyle', { detail: slideToPosition })
                    document.dispatchEvent(event)
                }
            }
        });
    },
    update: function (element, value) {
        element.val(value).change();
    }
}
$.getParameterByNameInUrl = function(name, url) {
	name = name.replace(/[\[\]]/g, '\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
/**
 * filteredProductListInit
 * Back 버튼을 통해 필터링된 상품 리스트 조회
 * @returns void
 */
$.Tstation.filteredProductListInit = function () {
    var srotTextVal = $("#srotText").val();
    if (!srotTextVal) srotTextVal ="listSort06";
    var srotTextFilterStr = "&srotText="+ srotTextVal;
    $('#srotTextHd').val(srotTextVal);
    var _goodsLrclCd = $("#goodsLrclCd").val();
    var _patternMode = $("#patternMode").val();
    if(!_patternMode) {
        // 사이즈 정해진 상품 리스트
        if(_goodsLrclCd =="01") {		// 타이어
            var tComSilAvgArryStr = "";
            if (drivingStyleHigh != null) {
                tComSilAvgArryStr = "&tComSilAvgArry=" + drivingStyleRow + "," + drivingStyleHigh;
            }
            var seasonFilterStr = "&seasonNmArry=";
            var seasonVal = "";
            $('input[name="season_check"]:checked').each(function(){
                if(	$('input[name="season_check"]:checked').index(this)>0){seasonVal += ","+$(this).val();}
                else {seasonVal += $(this).val();}
            });
        	seasonVal = encodeURI(encodeURIComponent(seasonVal))
            seasonFilterStr += seasonVal;
            if(seasonVal=="") seasonFilterStr= "";
            var carKndVal = $("input[name='carKnd_radio']:checked").val();
            var carKndFilterStr = "";
            if (carKndVal) carKndFilterStr = "&carKndNm="+carKndVal;
            var carKndNmValInUrl = $.getParameterByNameInUrl("carKndNm",window.location);
            if(carKndNmValInUrl != null ) {
                $('input[name="carKnd_radio"]').each(function(){
                    if($(this).val()==carKndNmValInUrl){
                        $(this).prop("checked",true);
                        $(this).attr("disabled",true);
                    }else $(this).attr("disabled",true)
                })
            }

            mgoods.product.getProductList(["premium", "standard", "economy"], srotTextFilterStr + seasonFilterStr + tComSilAvgArryStr);
        }else if(_goodsLrclCd =="02") {
            // 경정비

            var goodsMdclCdArry = $.getParameterByNameInUrl("goodsMdclCd",window.location).split(":");
            //정렬 순서
            mgoods.product.getProductList(goodsMdclCdArry,srotTextFilterStr);
        }
    }else {
        // 패턴 리스트
        //정렬 순서
        var srotTextVal = $("#srotText").find('.on > .srotText').attr('value');
        var srotTextFilterStr = "&srotText="+ srotTextVal;
        $('#srotTextHd').val(srotTextVal);
        if(_goodsLrclCd =="01") {
            var tComSilAvgArryStr = "";
            if (drivingStyleHigh != null) {
                tComSilAvgArryStr = "&tComSilAvgArry=" + drivingStyleRow + "," + drivingStyleHigh;
            }
            var seasonFilterStr = "&seasonNmArry=";
            var seasonVal = "";
            $('input[name="season_check"]:checked').each(function(){
                if(	$('input[name="season_check"]:checked').index(this)>0){seasonVal += ","+$(this).val();}
                else {seasonVal += $(this).val();}
            });
        	seasonVal = encodeURI(encodeURIComponent(seasonVal));
            seasonFilterStr += seasonVal;
            if(seasonVal=="") seasonFilterStr= "";
            var carKndVal = $("input[name='carKnd_radio']:checked").val();
            var carKndFilterStr = "";
            var carKndNmVal = $.getParameterByNameInUrl("carKndNm",window.location);
            if (carKndNmVal) carKndFilterStr = "&carKndNm="+carKndVal;
            if(carKndNmVal != null ) {
                $('input[name="carKnd_radio"]').each(function(){
                    if($(this).val()==carKndNmVal){
                        $(this).prop("checked",true);
                        $(this).attr("disabled",true);
                        carKndFilterStr = "";
                    }else $(this).attr("disabled",true)
                })
            }
            mgoods.patternList.getPatternList(["premium","standard","economy"],srotTextFilterStr + seasonFilterStr + carKndFilterStr);
        }else if(_goodsLrclCd =="02") {
            if (srotTextVal && srotTextVal != "listSort06") {
                mgoods.patternList.getPatternList([$('#goodsMdclCd').val()],srotTextFilterStrl);
            } else {
                mgoods.patternList.getPatternList([$('#goodsMdclCd').val()]);
            }
        }
    }
}


/* ----------------
 * - Load -
 * ----------------
 *
 */
// Ready - Before Mounted, Dom element is created
$(document).ready(function () {
    console.log('document ready done');
    $.Tstation.formControlTools();
    $.Tstation.tab.addEvent();
    $.Tstation.tab.init();
    $.Tstation.tabs.addEvent();
    $.Tstation.tabs.init();
    $.Tstation.popup();
    $.Tstation.formControlNumber();
    $.Tstation.productBuyProcessBar.methods.floating();
});

// Load - Mounted, Dom element is created & load resource is done
window.onload = function () {
    console.log('window on load done');
    $.Tstation.filteredProductListInit();
};


// plugins call: pointer events polyfill ---------------------------- //
PointerEventsPolyfill.initialize({});
