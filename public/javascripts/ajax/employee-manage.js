function clickConfirm(callback) {
    $('#modal-confirm').modal('show');
    $('#confirmTrue').click(function () {
        callback();
        $('#modal-confirm').modal('hide');
    });
}

$(function () {

    $('#deleteApply').click(function () {
        var id = $(this).data('id');
        clickConfirm(() => {
            $('#modal-loading').modal('show');
            $.get(`/data/employee/apply/delete?id=${id}`, (data) => {
                if (data) {
                    $('#modal-loading').modal('hide');
                    location.reload();
                } else {
                    alert("Đã xảy ra lỗi");
                }
            });

        });
    });

    $('#approveApply').click(function(){
        var id = $(this).data('id');
        clickConfirm(() => {
            $('#modal-loading').modal('show');
            $.get(`/data/employee/apply/approve?id=${id}`, (data) => {
                if (data) {
                    $('#modal-loading').modal('hide');
                    location.reload();
                } else {
                    alert("Đã xảy ra lỗi");
                }
            });
        });
    });

    $('#deleteEmp').click(function () {
        var id = $(this).data('id');
        clickConfirm(() => {
            $('#modal-loading').modal('show');
            $.get(`/data/employee/delete?id=${id}`, (data) => {
                if (data) {
                    $('#modal-loading').modal('hide');
                    location.reload();
                } else {
                    alert("Đã xảy ra lỗi");
                }
            });

        });
    });

    $('#changeRole').change(function () {
        var id = $(this).data('id');
        var val = $(this).val();
    
        clickConfirm(() => {
            $('#modal-loading').modal('show');
            $.get(`/data/employee/changerole?id=${id}&role=${val}`, (data) => {
                if (data) {
                    $('#modal-loading').modal('hide');
                    location.reload();
                } else {
                    alert("Đã xảy ra lỗi");
                }
            });

        });
    });

});