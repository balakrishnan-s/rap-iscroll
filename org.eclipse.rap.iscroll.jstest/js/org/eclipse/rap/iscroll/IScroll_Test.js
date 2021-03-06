﻿/*******************************************************************************
 * Copyright (c) 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/

(function(){

// imports:
var IScroll = org.eclipse.rap.iscroll.IScroll;

// static imports:
var touch = org.eclipse.rap.iscroll.IScrollTestUtil.touch;

var div;
var wrapper;
var scroller;

qx.Class.define( "org.eclipse.rap.iscroll.IScroll_Test", {

  extend : qx.core.Object,

  members : {

    testIScrollIsPresent : function() {
      assertEquals( "function", typeof IScroll );
    },

    testCreateInstannce : function() {
      var iScroll = new IScroll( wrapper );
      assertTrue( iScroll instanceof IScroll );
    },

    testGetElements : function() {
      var iScroll = new IScroll( wrapper );
      assertIdentical( wrapper, iScroll.wrapper );
      assertIdentical( scroller, iScroll.scroller );
    },

    testMaxScroll : function() {
      var iScroll = new IScroll( wrapper );
      assertEquals( -900, iScroll.maxScrollX );
      assertEquals( -900, iScroll.maxScrollY );
      assertTrue( iScroll.hScroll );
      assertTrue( iScroll.vScroll );
    },

    testMaxScrollChangedByScroller : function() {
      var iScroll = new IScroll( wrapper );

      scroller.style.width = "500px";
      scroller.style.height = "1500px";
      iScroll.refresh();

      assertEquals( -400, iScroll.maxScrollX );
      assertEquals( -1400, iScroll.maxScrollY );
      assertTrue( iScroll.hScroll );
      assertTrue( iScroll.vScroll );
    },

    testMaxScrollChangedByWrapper : function() {
      var iScroll = new IScroll( wrapper );

      wrapper.style.width = "50px";
      wrapper.style.height = "300px";
      iScroll.refresh();

      assertEquals( -950, iScroll.maxScrollX );
      assertEquals( -700, iScroll.maxScrollY );
      assertTrue( iScroll.hScroll );
      assertTrue( iScroll.vScroll );
    },

    testMaxScrollChangedNonScrollableByScroller : function() {
      var iScroll = new IScroll( wrapper );

      scroller.style.width = "90px";
      scroller.style.height = "50px";
      iScroll.refresh();

      assertFalse( iScroll.hScroll );
      assertTrue( iScroll.vScroll ); // this is due to the "elastic" effect (bounceLock is false)
    },

    testMaxScrollChangedNonScrollableByWrapper : function() {
      var iScroll = new IScroll( wrapper );

      wrapper.style.width = "1000px";
      wrapper.style.height = "1300px";
      iScroll.refresh();

      assertFalse( iScroll.hScroll );
      assertTrue( iScroll.vScroll ); // this is due to the "elastic" effect (bounceLock is false)
    },

    testSetGetPosition : function() {
      var iScroll = new IScroll( wrapper );

      iScroll.setScrollPosition( -10, -15 );

      assertEquals( -10, iScroll.x );
      assertEquals( -15, iScroll.y );
    },

    testScrollEvent : function() {
      var log = [];
      var iScroll = new IScroll( wrapper, {
        "onScroll" : function(){
          log.push( [ this.x, this.y ] );
        }
      } );

      iScroll.setScrollPosition( -10, -15 );
      iScroll.setScrollPosition( 0, 0 );
      iScroll.setScrollPosition( 0, 0 );

      assertEquals( 2, log.length );
      assertEquals( [ -10, -15 ], log[ 0 ] );
      assertEquals( [ 0, 0 ], log[ 1 ] );
    },

    testSetPositionNegative : function() {
      var iScroll = new IScroll( wrapper );

      iScroll.setScrollPosition( 10, 15 );

      assertEquals( 10, iScroll.x );
      assertEquals( 15, iScroll.y );
    },

    testSetPositionOverMax : function() {
      var iScroll = new IScroll( wrapper );

      iScroll.setScrollPosition( -1000, -1100 );

      assertEquals( -1000, iScroll.x );
      assertEquals( -1100, iScroll.y );
    },

    testScrollByTouch : function() {
      var log = [];
      var iScroll = new IScroll( wrapper, {
        "onScroll" : function(){
          log.push( [ this.x, this.y ] );
        },
        "lockDirection" : false,
        "bounce" : false
      } );

      touch( "start", iScroll, [ 30, 40 ] );
      touch( "move", iScroll, [ 30, 20 ] );
      touch( "move", iScroll, [ 20, 20 ] );
      touch( "end", iScroll, [ 20, 20 ] );

      assertEquals( 2, log.length );
      assertEquals( [ 0, -20 ], log[ 0 ] );
      assertEquals( [ -10, -20 ], log[ 1 ] );
    },

    testDisable : function() {
      var log = [];
      var iScroll = new IScroll( wrapper, {
        "onScroll" : function(){
          log.push( [ this.x, this.y ] );
        },
        "lockDirection" : false,
        "bounce" : false
      } );
      iScroll.disable();

      touch( "start", iScroll, [ 30, 40 ] );
      touch( "move", iScroll, [ 30, 20 ] );
      touch( "move", iScroll, [ 20, 20 ] );
      touch( "end", iScroll, [ 20, 20 ] );

      assertEquals( 0, log.length );
    },

    testEnable : function() {
      var log = [];
      var iScroll = new IScroll( wrapper, {
        "onScroll" : function(){
          log.push( [ this.x, this.y ] );
        },
        "lockDirection" : false,
        "bounce" : false
      } );
      iScroll.disable();
      iScroll.enable();

      touch( "start", iScroll, [ 30, 40 ] );
      touch( "move", iScroll, [ 30, 20 ] );
      touch( "move", iScroll, [ 20, 20 ] );
      touch( "end", iScroll, [ 20, 20 ] );

      assertEquals( 2, log.length );
      assertEquals( [ 0, -20 ], log[ 0 ] );
      assertEquals( [ -10, -20 ], log[ 1 ] );
    },

    testDisableInScrollstart : function() {
      var log = [];
      var iScroll = new IScroll( wrapper, {
        "onScroll" : function(){
          log.push( [ this.x, this.y ] );
        },
        "lockDirection" : false,
        "bounce" : false,
        "onBeforeScrollStart" : function( e ) {
          iScroll.disable();
        },
        "onScrollStart" : function() {
          log.push( "start" );
        }
      } );

      touch( "start", iScroll, [ 30, 40 ] );
      touch( "move", iScroll, [ 30, 20 ] );
      touch( "move", iScroll, [ 20, 20 ] );
      touch( "end", iScroll, [ 20, 20 ] );

      assertEquals( 0, log.length );
    },

    setUp : function() {
      div = document.createElement( "div" );
      document.body.appendChild( div );
      wrapper = document.createElement( "div" );
      wrapper.style.width = "100px";
      wrapper.style.height = "100px";
      div.appendChild( wrapper );
      scroller = document.createElement( "div" );
      scroller.style.width = "1000px";
      scroller.style.height = "1000px";
      wrapper.appendChild( scroller );
    },

    tearDown : function() {
      document.body.removeChild( div );
      div = null;
      wrapper = null;
      scroller = null;
    }

  }

} );

}());