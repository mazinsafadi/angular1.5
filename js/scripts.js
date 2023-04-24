$(document).ready(function () {
    $('.demo-header').dfwHeader("");
    $('.demo-footer').dfwIconicsFooter();
    searchResultsWrapHeight();

    function searchResultsWrapHeight() {
        $('#searchResults').css("height", ($('#mainWrapper').height()) - ($('#searchSection').height()) - ($('.mktMgmt-header').height()) - ($('#menu').height()) - ($('#logoutSection').height()) - 50);
    }
    //Package Selection
    $('.dragDrop-section > div:first-child').attr('id', 'test');
    var selected = "";
    $(function () {
            $('#toRight').on('click', function (event) {
                $('#leftTable li').each(function (e, s) {
                    a = $(s).attr('aria-grabbed');
                    if (a == 'true') {
                        $('#rightTable').append($(s))
                    }
                })
            })
            $('#toLeft').on('click', function () {
                $('#rightTable li').each(function (e, s) {
                    a = $(s).attr('aria-grabbed');
                    if (a == 'true') {
                        $('#leftTable').append($(s))
                    }
                })
            })
        })
        //
        // If validation is desired, add the following code:
        //
        /*$('#dt-nozone').validate({errorClass: "dfw-validate-error-msg",
        	onkeyup: false,
        	errorPlacement: function(error,element) {
        		error.insertAfter($(element).parent('div'));
        	}*/
});

function landingWindowAutoajustHeight() {
    $topWrapHeight = $('#logoutSection').height();
    $landingheight = $(window).height();
    $("body #mainWrapper").css("height", $landingheight - $topWrapHeight - 30);
    $('#homeContent').css("height", $(window).height() - ($('.mktMgmt-header').height()) - ($('#menu').height()) - ($('.mktMgmtFooter').height()) - ($('#logoutSection').height()) - 100);
}