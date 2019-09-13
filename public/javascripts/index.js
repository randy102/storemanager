$(function(){
    /**Add Active class to sidebar */
    var curPage = $('currentPage').html().split('-')[0];
    $('sidebar>ul>li>a').removeClass('active');
    var active = $(`sidebar>ul>li>a[href='/${curPage}']`);
    active.addClass('active');


    /**Add color to shift table*/
    $('cal-body td[am]').addClass('table-info');
    $('cal-body td[pm]').addClass('table-danger');
   

    /**Active Bootstrap Tooltip */
    $('[data-toggle="tooltip"]').tooltip(); 
    
    

    /**Upload Img button in Notification */
    $('#upload-img-btn').click(function(){
        $('#upload-img-form').click();
    });

    /**Upload Img button in Profile */
    $('#change-profile-btn').click(function(){
        $('#change-profile-img').click();
    });

    /**View Password in Profile */
    $('#view-password').click(function(){
        var state = $('#password').attr('type');
        var newState = (state=='password')?'text':'password';
        $('#password').attr('type',newState);
    });


    /**Textarea autogrow in Notification */
    $(".notif-create textarea").keyup(function(e) {
        while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
            $(this).height($(this).height()+1);
        };
    });

    /**Image click zoom in Notification */
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

    /**Scroll to bottom in Chat room */
    if($('.chat-content')[0])
        $('.chat-content').scrollTop($('.chat-content')[0].scrollHeight);

    
});
