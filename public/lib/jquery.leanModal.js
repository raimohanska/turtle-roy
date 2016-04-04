(function($){
  $.fn.extend({
    leanModal: function(options) {
      var defaults = {
        overlay: 0.5,
        closeButton: null
      };
      var overlay = $("<div id='lean_overlay'></div>");
      $("body").append(overlay);
      options =  $.extend(defaults, options);

      return this.each(function() {
        var o = options;
        var modal_id = $(this).attr("href");

        $(document).keyup(function(e) {
          // close with esc
          if (e.keyCode == 27)  close_modal(modal_id)
        });

        $(this).click(function(e) {

          $("#lean_overlay").click(function() {
            close_modal(modal_id);
          });
          $(o.closeButton).click(function() {
            close_modal(modal_id);
          });
          $('#lean_overlay').css({ 'display' : 'block', opacity : 0 });
          $('#lean_overlay').fadeTo(200,o.overlay);
          $(modal_id).css({
            'display' : 'block',
            'opacity' : 0,
            'z-index': 11000,
          });
          $(modal_id).fadeTo(200,1);
          e.preventDefault();
        });
      });
      function close_modal(modal_id){
        $("#lean_overlay").fadeOut(200);
        $(modal_id).css({ 'display' : 'none' });
      }
    }
  });
})(jQuery);
