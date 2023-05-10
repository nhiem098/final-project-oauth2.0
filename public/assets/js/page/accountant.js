$(document).ready(function () {
    // Khởi tạo Select2 của select chọn 1 option
    $('.single-select').select2({
        theme: 'bootstrap4',
        width: '100%',
        dropdownParent: $('#carModal'),
    });

    // Khởi tạo multiple Select2 của select chọn nhiều option
    $('.multiple-select').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : '100%',
        allowClear: Boolean($(this).data('allow-clear')),
        dropdownParent: $('#carModal'),
    });

    // Khởi tạo Select2 của input nhập số xe
    $('#input_car').select2({
        theme: 'bootstrap4',
        width: '100%',
        dropdownParent: $('#carModal'),
        delay: 250,
        language: 'vi',
        ajax: {
            async: false,
            type: 'POST',
            dataType: 'json',
            url: link_get_car_by_car_number,
            data: function (params) {
                var query = {
                    car_number: params.term,
                }
                return query;
            },
            processResults: function (data) {
                let result = null;
                if(data.search && data.search !== '' && data.status){
                    cars = data.cars;
                    result = {
                        "results" : [{
                            'text': 'Biển số ' + data.search + ' - Không tìm thấy thông tin! Tạo mới xe vãng lai.',
                            'car_type_id': 0,
                            'car_type': '',
                            'company_id': 0,
                            'company': 'Xe vãng lai',
                            'id': data.search
                        }]
                    };
                    if(cars.length > 0){
                        result = {
                            "results" : $.map(data.cars, function (car) {
                                return {
                                    'text': 'Biển số ' + car.car_number + ' - ' + car.car_type.name + ' - ' + car.company.name,
                                    'car_type_id': car.type_id,
                                    'car_type': car.car_type.name,
                                    'company_sid': car.company_id,
                                    'company': car.company.name,
                                    'id': car.car_number
                                }
                            })
                        };
                    }
                    return result;
                }
            },
            cache: true
        },
        placeholder: $("#input_car").data('placeholder'),
        allowClear: true
    });

    // Event xử lý khi form tạo mới submit
    $("#formCreateInvoice").submit(function (e) { 
        e.preventDefault();
        let data = $(this).serialize();
        ajaxSubmitCreateInvoice(data)
    });

    // Ajax tạo mới phiếu thu tiền
    function ajaxSubmitCreateInvoice(data){
        $.ajax({
            type: "POST",
            url: link_post_store_invoice+"?"+data,
            success: function (response) {
                if(response.status === true){
                    Swal.fire(
                        'Chúc mừng!',
                        response.message,
                        'success'
                    ).then((result) => {
                        location.reload();
                    });
                }
            },
            error: function (xhr){
                Swal.fire(
                    'Thất bại!',
                    xhr.responseJSON.message,
                    'error'
                );
            }
        });
    };

    // Event xử lý khi chọn option của xe (form tạo) 
    $('#input_car').on('select2:select', function(e){
        let data = e.params.data;
        $("#input_company").val(data.company).attr('company_id', data.company_id);
        $("#car_type").val(data.car_type_id).trigger('change');
        updatePriceByCarType(data.car_type_id);
    });

    // Event xử lý khi chọn option của loại xe (form tạo) 
    $("#car_type").on('select2:select', function(e){
        let data = e.params.data;
        updatePriceByCarType(data.id);
    });

    // Function: cập nhật giá theo loại xe
    function updatePriceByCarType(car_type_id = 0){
        let result = 
            `<option value="" disabled selected>Vui lòng chọn giá</option>
            <option value="other">Giá khác</option>`;
        $.ajax({
            async: false,
            type: "POST",
            url: link_get_price_by_car_type,
            data: {
                car_type_id: car_type_id
            },
            success: function (response) {
                let list_price = response.list_price;
                $.map(list_price, function (params) {
                    let price = params.status_tet ? params.price_tet : params.price;
                    let name_other = params.status_tet ? (' - Giá ngày lễ, tết') : '';
                    let data = {
                        'text': new Intl.NumberFormat().format(price) + ' VNĐ - ' + params.name + name_other,
                        'id': params.id
                    }
                    var newOption = '<option value="'+data.id+'">'+data.text+'</option>';
                    result += newOption;
                })

                $("#price").empty().append(result).trigger('change');

                if(list_price.length < 1){
                    $("#price").val(0).trigger('change');
                    showDivPriceOther();
                } else{
                    hideDivPriceOther();
                }
            }
        });
    }

    // Event xử lý khi chọn option của giá (form tạo)
    $("#price").on('select2:select', function(e){
        let data = e.params.data;
        if(data.id === 'other'){
            showDivPriceOther();
        }else{
            hideDivPriceOther();
        }
    });

    // Function: ẩn thẻ div "giá khác"
    function hideDivPriceOther(){
        $("#div-price").removeClass('col-md-3').addClass('col-md-6');
        $("#div-price-other").addClass('d-none');
    }

    // Function: show thẻ div "giá khác"
    function showDivPriceOther(){
        $("#div-price").removeClass('col-md-6').addClass('col-md-3');
        $("#div-price-other").removeClass('d-none');
    }

    $('#InvoiceDeltailModal').on('show.bs.modal', function () {
        
    });

    // Event khi click nút xem chi tiết phiếu
    $(".btn-detail").click(function(){
        resetDetailInvoice();
        let invoice_id = $(this).data('invoice_id');
        let invoice = ajaxGetInfoInvoiceById(invoice_id);

        if((Array.isArray(invoice) && invoice.length > 0) || (typeof invoice === 'object' && Object.keys(invoice).length > 0))
            showDetailInvoice(invoice);
            
    });

    // Ajax lấy thông tin chi tiết phiếu thu tiền theo id phiếu
    function ajaxGetInfoInvoiceById(invoice_id = 0) {  
        let result = Array();
        $.ajax({
            type: "POST",
            url: link_get_detail_invoice,
            data: {
                invoice_id: invoice_id
            },
            async: false,
            success: function (response) {
                if(response.status === true)
                    result = response.invoice;
            }
        });
        return result;
    }

    function showDetailInvoice(invoice){
        $("#detail_car_number").text(invoice['car_number']);
        $("#detail_company").text(invoice['company']);
        $("#detail_car_type").text(invoice['car_type']);
        $("#detail_checkin").text(invoice['checkin']);
        $("#detail_checkout").text(invoice['checkout']);
        $("#detail_parking_time").text(invoice['parking_time']);
        $("#detail_status").html(invoice['status']);
        $("#detail_note").text(invoice['note']);
    }

    function resetDetailInvoice(){
        $("#detail_car_number").text('');
        $("#detail_company").text('');
        $("#detail_car_type").text('');
        $("#detail_checkin").text('');
        $("#detail_checkout").text('');
        $("#detail_parking_time").text('');
        // $("#detail_price").empty();
        $("#detail_status").text('');
        $("#detail_note").text('');
    }

    $(".btn-delete").click(function(){
        Swal.fire(
            'Cảnh báo!',
            'Bạn có chắc chắn muốn hủy phiếu thu tiền này',
            'warning'
        ).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Chức mừng!', 'Bạn đã hủy phiếu thành công.', 'success')
            } else if (result.isDenied) {
                Swal.fire('Thất bại!', 'Hủy phiếu thành công. Xin vui lòng kiểm tra lại!', 'error')
            }
        });
    })

    function ajaxGetCarTypeByCar(car_id = 0) {  
        let result = Array();
        $.ajax({
            type: "POST",
            url: link_get_car_by_company,
            data: {
                car_id: car_id
            },
            async: false,
            success: function (response) {
                console.log(response);
                result = response.cars;
            }
        });
        return result;
    }

});