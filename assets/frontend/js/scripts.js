// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    });
}

function renderZoneOptions(data, selected){
    let html = '';
    let i=0;

    $.each(data, function(key, val) {

        let selectedStr = '';
        if( selected && selected === parseInt(key) ){
            selectedStr = 'selected="selected"';
        }

        html += '<option value="'+key+'" '+ selectedStr +'>'+val+'</option>';
    });
    return html;
}

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 0 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return 'Rp ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")  + ',-';
};

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

jQuery(function($) {

   /* var url = getParameterByName('url'); //"https://www.google.com/maps/place/Arctic+Pixel+Digital+Solutions/@63.6741553,-164.9587713,4z/data=!3m1!4b1!4m5!3m4!1s0x5133b2ed09c706b9:0x66deacb5f48c5d57!8m2!3d64.751111!4d-147.3494442";
    var regex = new RegExp('@(.*),(.*),');
    var lon_lat_match = url.match(regex);
    var lat = lon_lat_match[1];
    var lng = lon_lat_match[2];
    console.log(lon_lat_match);
    console.log("Lat:"+lat);
    console.log("Lng:"+lng);*/

    $.fn.inputFilter = function(inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };

    // Restrict input to digits by using a regular expression filter.
    $(".number-only").inputFilter(function(value) {
        return /^\d*$/.test(value);
    });

    //var host = config.routes.front_url;
    var body = $('body');

    body.on('change', '.submit-on-change', function (e) {
        $(this).closest('form').submit();
    });

    body.on('change', '.reset-ftr-all', function (e) {
        window.location = $(this).data('url');
    });

    body.on('click', '.btn-alert-delete', function (e) {
        if( confirm("Are you sure?") ){
            $(this).closest('form').submit();
        }
        return false;
    });

    body.on('click', '.alert-delete', function(e){
        e.preventDefault();
        if( confirm("Are you sure?") ){
            window.location = $(this).attr('href');
        }

        return false;
    });


    /*
     * SINGLE LB,
     * */
    /* fixed radio button selected */
    $('.lb-popup-detail').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-animation',
        removalDelay: 200,
        showCloseBtn: false,
        callbacks: {
            open: function() {
                let selectedItem = $(this.contentContainer).find('.lb-item[data-checked="checked"]');
                if ( selectedItem.length > 0 ){
                    selectedItem.prop('checked', "checked").click()
                    selectedItem.click();
                    selectedItem.change();
                }
            },
            close: function() {
                // Will fire when popup is closed
            }
            // e.t.c.
        }
    });

    $('.js-pinpoint').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-animation',
        removalDelay: 200,
        showCloseBtn: false,
        callbacks: {
            open: function() {

            },
            close: function() {
                // Will fire when popup is closed
            }
            // e.t.c.
        }
    });

    function triggerPopupLb(parent){
        let subtotal = parent.find('.lb-subtotal');
        let image = parent.find('.lb-image');

        /* item */
        let item  = parent.find('.lb-item:checked');
        let itemImage  = item.length > 0 && item.attr('data-image') ? item.attr('data-image') : image.attr('src');
        let itemPrice = item.length > 0 ? item.attr('data-price') : 0;

        /* extra */
        let extras  = parent.find('.lb-extras:checked');
        let extrasPrice = 0;
        $.each(extras, function () {
            extrasPrice += parseInt($(this).attr('data-price'));
        });

        /* qty */
        let inputQty  = parent.find('.lb-qty');
        let qty  = inputQty.val();
        let minQty  = inputQty.attr('min');
        let maxQty  = inputQty.attr('max');

        if( parseInt(qty) < parseInt(minQty) ){
            alert('min qty is '+ minQty);
            inputQty.val(minQty);
            qty = minQty;
        }

        if( parseInt(qty) > parseInt(maxQty) ){
            alert('max qty is '+ maxQty);
            inputQty.val(maxQty);
            qty = maxQty;
        }

        let totalPrice =  ( parseInt(itemPrice) + parseInt(extrasPrice) ) * parseInt(qty);

        subtotal.html(formatMoney(totalPrice));
        image.attr('src', itemImage)
    }

    /* popup lunchbox archive */
    body.on('change, click', '.lb-trigger-price', function () {
        let parent = $(this).closest('.lb-wrapper');

        triggerPopupLb(parent);
    });

    function triggerPopupLbCustom(parent){
        let subtotal = parent.find('.lb-custom-subtotal');
        let image = parent.find('.lb-custom-image');

        /* item */
        let item  = parent.find('.lb-custom-item');
        let itemImage = item.length > 0 && item.attr('data-image') ? item.attr('data-image') : image.attr('src');
        let itemPrice = item.length > 0 ? item.attr('data-price') : 0;

        /* extra */
        let extras  = parent.find('.lb-custom-extras:checked');
        let extrasPrice = 0;
        $.each(extras, function () {
            extrasPrice += parseInt($(this).attr('data-price'));
        });

        /* qty */
        let inputQty  = parent.find('.lb-custom-qty');
        let qty  = inputQty.val();
        let minQty  = inputQty.attr('min');
        let maxQty  = inputQty.attr('max');

        if( parseInt(qty) < parseInt(minQty) ){
            alert('min qty is '+ minQty);
            inputQty.val(minQty);
            qty = minQty;
        }

        if( parseInt(qty) > parseInt(maxQty) ){
            alert('max qty is '+ maxQty);
            inputQty.val(maxQty);
            qty = maxQty;
        }

        //console.log([item]);

        let totalPrice =  ( parseInt(itemPrice) + parseInt(extrasPrice) ) * parseInt(qty);

        subtotal.html(formatMoney(totalPrice));
        image.attr('src', itemImage)
    }

    /* popup lunchbox archive */
    body.on('change, click', '.lb-custom-trigger-price', function () {
        let parent = $(this).closest('.lb-custom-wrapper');

        triggerPopupLbCustom(parent);
    });


    /*
     * CART
     * */
    function triggerCartOverview(overview){
        let parent = $('.site-header-cart');
        parent.html(overview);
        $.getScript( 'assets/frontend/js/libs/jquery.spinner.js' )
            .done(function( script, textStatus ) {
                body.find('.js-form-input-spinner').spinner();
            })
            .fail(function( jqxhr, settings, exception ) {
                $( "div.log" ).text( "Triggered ajaxError handler." );
            });
        $.getScript( 'assets/frontend/js/style.js' )
        .done(function( script, textStatus ) {
            console.log( textStatus );
            const $body = document.querySelector('body');
            const $cartOverviewToggle = $body.querySelector('a[href="#cart-overview"]');
            $cartOverviewToggle.click();
        })
        .fail(function( jqxhr, settings, exception ) {
            $( "div.log" ).text( "Triggered ajaxError handler." );
        });
    }

    function triggerUpdateCartOverview(elem){
        let parent = elem.closest('.cart-overview');
        let grouping = elem.closest('.cart-overview-item');
        let url = grouping.attr('data-url-update');
        let cartKey = grouping.attr('data-cart-key');
        let cartKeyEncode = grouping.attr('data-cart-key-encode');
        let inputQty = body.find('#input-product-qty-'+ cartKeyEncode);
        let qty = inputQty.val();
        let minQty = inputQty.attr('min');
        let maxQty = inputQty.attr('max');

        if( parseInt(qty) < parseInt(minQty) ){
            alert("min qty is "+ minQty);
            inputQty.val(minQty);
            return false;
        }

        if( parseInt(qty) > parseInt(maxQty) ){
            alert("max qty is "+ maxQty);
            inputQty.val(maxQty);
            return false;
        }

        parent.addClass('is-loading');
        body.find('.message-error').remove();

        $.ajax({
            method: "post",
            url: url,
            data: {
                cartKey: cartKey,
                qty: qty,
                _token: config._token
            }
        })
        .done(function (resp) {
            parent.removeClass('is-loading');

            if ( resp.status ) {
                triggerCartOverview(resp.overview);
            } else {
                if( resp.fixed_qty ) {
                    inputQty.val(resp.fixed_qty);
                    inputQty.closest('.qty').after("<p class='message-error'>" + resp.message + "</p>");
                }
            }
        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
        });
    }

    /* add to cart popup lunchbox */
    body.on('click', '.lb-add-cart', function () {
        let popup = $(this).closest('.popup-inline');
        let parent = $(this).closest('.lb-wrapper');
        let url = $(this).attr('data-url');
        let lunchbox = $(this).attr('data-lb');

        /* item */
        let item  = parent.find('.lb-item:checked').val();

        /* extra */
        let extras  = parent.find('.lb-extras:checked');
        let extrasIds = [];
        if( extras.length > 0 ) {
            $.each(extras, function () {
                extrasIds.push($(this).val());
            });
        }

        /* snacks */
        let snacks  = parent.find('.lb-snack');
        console.log(snacks);
        let snacksIds = [];
        if( snacks.length > 0 ) {
            $.each(snacks, function () {
                snacksIds.push($(this).val());
            });
        }

        /* qty */
        let inputQty  = parent.find('.lb-qty');
        let qty  = inputQty.val();
        let minQty  = inputQty.attr('min');
        let maxQty  = inputQty.attr('max');

        if( parseInt(qty) < parseInt(minQty) ){
            alert('min qty is '+ minQty);
            inputQty.val(minQty)
            return false;
        }

        if( parseInt(qty) > parseInt(maxQty) ){
            alert('max qty is '+ maxQty);
            inputQty.val(maxQty)
            return false;
        }

        /* lunchbox custom */
        let lunchboxCustom = null;

        parent.addClass('is-loading');

        $.ajax({
            method: "post",
            url: url,
            data: {
                lb: lunchbox,
                lbCustom: lunchboxCustom,
                item: item,
                extras: extrasIds,
                qty: qty,
                snacks: snacksIds,
                _token: config._token
            }
        })
        .done(function (resp) {
            parent.removeClass('is-loading');
            if (resp) {
                popup.find('.close').click();
                triggerCartOverview(resp.overview);
            }
        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
            alert(resp);
        });
    });

    /* add to cart popup lunchbox custom */
    body.on('click', '.lb-custom-add-cart', function () {

        let input = $(this).closest('.product-order-column').find('.product-order-variant input');
        //console.log(input);
        let error = 0;
        body.find('.error-lb-custom').remove();
        $.each(input, function () {
            if( $(this).val() == '' ){
                $(this).closest('.form-input-field').after('<span class="error-lb-custom alert">Harap diisi</span>');
                error += 1;
            }
        });

        if( error > 0 ){
            return false;
        }

        let popup = $(this).closest('.popup-inline');
        let parent = $(this).closest('.lb-custom-wrapper');
        let url = $(this).attr('data-url');
        let lunchboxCustom = $(this).attr('data-lb-custom');

        /* lunchbox */
        let lunchbox = null;

        /* item */
        let item  = null;

        /* extra */
        let extras  = parent.find('.lb-custom-extras:checked');
        let extrasIds = [];
        if( extras.length > 0 ) {
            $.each(extras, function () {
                extrasIds.push($(this).val());
            });
        }

        /* snacks */
        let snacksIds = [];

        let notes = parent.find('.product-order-variants .choice .input');
        let notesVal = [];
        $.each( notes, function () {
            let name = $(this).data('name');
            let val = $(this).val();
            if( name ) {
                notesVal.push({name: name, val: val});
            }
        })

        /* qty */
        let qty  = parent.find('.lb-custom-qty').val();

        parent.addClass('is-loading');

        $.ajax({
            method: "post",
            url: url,
            data: {
                lb: lunchbox,
                lbCustom: lunchboxCustom,
                item: item,
                extras: extrasIds,
                qty: qty,
                snacks: snacksIds,
                notes: notesVal,
                _token: config._token
            }
        })
        .done(function (resp) {
            parent.removeClass('is-loading');
            if (resp.status) {
                popup.find('.close').click();
                triggerCartOverview(resp.overview);
            } else {
                alert(resp.message);
            }
        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
            alert(resp);
        });
    });

    /* update cart popup cart overview */
    body.on('click', '.lb-update-cart-item', function () {
        triggerUpdateCartOverview($(this));
    });

    /* update cart popup cart overview */
    body.on('change', '.lb-update-qty-cart-item', function () {
        triggerUpdateCartOverview($(this));
    });

    /* remove cart popup cart overview */
    body.on('click', '.lb-remove-cart-item', function () {

        if( confirm("Are you sure?") ) {

            let parent = $(this).closest('.cart-overview');
            let grouping = $(this).closest('.cart-overview-item');
            let url = grouping.attr('data-url-remove');
            let cartKey = grouping.attr('data-cart-key');
            parent.addClass('is-loading');

            $.ajax({
                method: "post",
                url: url,
                data: {
                    cartKey: cartKey,
                    _token: config._token
                }
            })
                .done(function (resp) {
                    parent.removeClass('is-loading');
                    if (resp.status) {
                        triggerCartOverview(resp.overview);
                        //grouping.remove();
                    }
                })
                .fail(function (resp) {
                    parent.removeClass('is-loading');
                });
        }

        return false;
    });

    /*
     * CHECKOUT
     * */
    /*let addressPicker = $('#popup-address-picker');
    function loadPickFirst(){
        let picker = $('.address-picker-action .button');

        picker.addClass('is-hidden');
        picker.addClass('is-tabbed');

        let pickAddressExist = $('.pick-address-exist');
        let addAddress = $('.add-address');
        let pickAddress = $('.picked-address');
        let submitAddress = $('.submit-address');

        addAddress.removeClass('is-tabbed');
        addAddress.removeClass('is-hidden');
        pickAddress.removeClass('is-tabbed');
        pickAddress.removeClass('is-hidden');
    }

    body.on('click', '.pick-address', function () {
        loadPickFirst();
    });




    */
    body.on('click', '.pick-address-exist', function () {
        let pickedAddress = $('.picked-address');
        let submitAddress = $('.submit-address');

        pickedAddress.removeClass('is-hidden');
        submitAddress.addClass('is-hidden');
    });

    body.on('click', '.add-address', function () {

        let pickedAddress = $('.picked-address');
        let submitAddress = $('.submit-address');

        pickedAddress.addClass('is-hidden');
        submitAddress.removeClass('is-hidden');
    });


    body.on('click', '.submit-address', function () {
        let form = $('.form-submit-address');

        let rmReqs = form.find('.rm-req');
        let error = 0;

        form.find('.error-address-input').remove();
        $.each( rmReqs , function(){
            if( $(this).val() == "" ){
                $(this).closest('.form-input-field').after('<span class="error-address-input alert">Harap diisi</span>');
                error += 1;
            }
        } );

        let rmReqCoords = form.find('.rm-req-coordinate');
        $.each( rmReqCoords , function(){
            if( $(this).val() == "" ){
                body.find('.form-pinpoint-field').after('<span class="error-address-input alert">Harap diisi</span>');
                error += 1;
            }
        } );

        if( error ){
            return false;
        }


        form.submit();
    });

    /* pick address checkout */
    var pickAddress = $('.pick-address').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-animation',
        removalDelay: 200,
        showCloseBtn: false,
        callbacks: {
            open: function() {
                //loadPickFirst();
                //console.log('opened');
                let tab = getParameterByName('tab');
                let pickedAddress = $('.picked-address');
                let submitAddress = $('.submit-address');

                if( tab == 'address-picker-new' ){
                    pickedAddress.addClass('is-hidden');
                    submitAddress.removeClass('is-hidden');
                } else {
                    pickedAddress.removeClass('is-hidden');
                    submitAddress.addClass('is-hidden');
                }
            },
            close: function() {

            }
            // e.t.c.
        }
    });

    /* pick address checkout */
    body.on('click', '.input-pick-address', function () {
        let inputRealAddress = $('#selected-address');
        inputRealAddress.val($(this).val());
    });

    body.on('click', '.picked-address', function (event) {

        let pickedAddress = body.find('.checkout-address-detail');
        let inputRealAddress = $('#selected-address');
        let addressOld = pickedAddress.html();
        let addressMapOld = pickedAddress.attr('data-address');

        let selectedAddress = $('.input-pick-address:checked');
        let addressNew = addressOld;
        let addressNewMap = addressMapOld;
        if( selectedAddress.length > 0 ) {
            addressNew = selectedAddress.parent().find('.address-alias').html();
            addressNewMap = selectedAddress.parent().find('.address-map-alias').text();

            pickedAddress.attr('data-id', selectedAddress.val())
            inputRealAddress.val(selectedAddress.val());

        }

        pickedAddress.html(addressNew);
        pickedAddress.attr('data-address', addressNewMap);

        pickAddress.magnificPopup('close');
        event.preventDefault();

    });

    function triggerCheckoutSummary(elem){
        body.find('.checkout-form-final').replaceWith(elem);
    }

    function triggerCheckoutOverview(elem){
        body.find('.checkout-overview-items').html(elem);
        body.find('.js-form-input-spinner').spinner();
    }

    /* update summary from shipping method*/
    body.on('click', '.shp-method', function () {
        let parent = $('.checkout-page-content');
        let val = $(this).val();
        let url = parent.attr('data-url-shp-method');
        parent.addClass('is-loading');

        console.log(val);

        /*body.find('.rm-req').removeAttr('required');
        body.find('.'+ val + '-req').attr('required', true);*/

        body.find('.rm-req').removeClass('rm-req');
        body.find('.'+ val + '-req').addClass('rm-req');

        $.ajax({
            method: "post",
            url: url,
            data: {
                shpMethod: val,
                _token: config._token
            }
        })
        .done(function (resp) {
            parent.removeClass('is-loading');
            if (resp) {
                triggerCheckoutSummary(resp.summary);
            }
        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
            alert(resp);
        });
    });

    body.find('.shp-method:first').click();

    function triggerUpdateCheckoutOverview(elem){
        let parent = elem.closest('.checkout-overview');
        let grouping = elem.closest('.checkout-overview-item');
        let url = grouping.attr('data-url-update');
        let cartKey = grouping.attr('data-cart-key');
        let cartKeyEncode = grouping.attr('data-cart-key-encode');
        let inputQty = body.find('#input-product-qty-checkout-'+ cartKeyEncode);
        let qty = inputQty.val();
        let minQty = inputQty.attr('min');
        let maxQty = inputQty.attr('max');

        if( parseInt(qty) < parseInt(minQty) ){
            alert("min qty is "+ minQty);
            inputQty.val(minQty);
            return false;
        }

        if( parseInt(qty) > parseInt(maxQty) ){
            alert("max qty is "+ maxQty);
            inputQty.val(maxQty);
            return false;
        }

        parent.addClass('is-loading');
        body.find('.message-error').remove();

        $.ajax({
            method: "post",
            url: url,
            data: {
                cartKey: cartKey,
                qty: qty,
                _token: config._token
            }
        })
        .done(function (resp) {

            if( resp.is_refresh ){
                location.reload();
            }

            parent.removeClass('is-loading');

            if ( resp.status ) {
                triggerCheckoutSummary(resp.summary);
                triggerCheckoutOverview(resp.overview);
            } else {
                if( resp.fixed_qty ) {
                    inputQty.val(resp.fixed_qty);
                    inputQty.closest('.checkout-overview-qty').after("<p class='message-error'>" + resp.message + "</p>");
                }
            }

        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
            alert(resp);
        });
    }

    /* update summary from checkout items*/
    body.on('click', '.lb-update-checkout-item', function () {
        triggerUpdateCheckoutOverview($(this));
    })

    /* update checkout overview */
    body.on('change', '.lb-update-qty-checkout-item', function () {
        triggerUpdateCheckoutOverview($(this));
    });

    /* remove checkout overview */
    body.on('click', '.lb-remove-checkout-item', function () {

        if( confirm("Are you sure?") ) {

            let parent = $(this).closest('.checkout-overview');
            let grouping = $(this).closest('.checkout-overview-item');
            let url = grouping.attr('data-url-remove');
            let cartKey = grouping.attr('data-cart-key');
            parent.addClass('is-loading');

            $.ajax({
                method: "post",
                url: url,
                data: {
                    cartKey: cartKey,
                    _token: config._token
                }
            })
                .done(function (resp) {
                    console.log(resp);
                    parent.removeClass('is-loading');
                    if (resp.status) {
                        triggerCheckoutSummary(resp.summary);
                        triggerCheckoutOverview(resp.overview);
                    }

                    if( resp.redirect !=='' ){
                        window.location.href = resp.redirect;
                    }
                })
                .fail(function (resp) {
                    parent.removeClass('is-loading');
                });
        }

        return false;
    });

    /*
     * ZONE
     * */
    /* get district by regency id */
    body.on('change', '.input-regency', function () {
        let form = $(this).closest('form');
        let regId = $(this).val();
        let url = $(this).attr('data-url');
        let district = form.find('.input-district');
        let districtId = district.length > 0 ? district.data('district-id') : "";
        form.addClass('is-loading');

        $.ajax({
            method: "get",
            url: url,
            data: {
                regId: regId,
                districtId: districtId
            }
        })
        .done(function (resp) {
            form.removeClass('is-loading');
            if( resp && resp.data && resp.data.model ) {
                form.find('.input-district').html(renderZoneOptions(resp.data.model, parseInt(districtId)));
            }
        })
        .fail(function (resp) {
            form.removeClass('is-loading');
            //alert(resp);
        });
    });

    var regency = $('.input-regency');
    if( regency.length > 0 ) {
        $.each(regency, function () {
            if( $(this).data('regency-id') !== "" ){
                $(this).change();
            }
        })
    }

    var inputDate = $('#input-checkout-date');
    var inputHour = $('#input-checkout-hour');
    var inputHourDefault = $('#input-checkout-hour-default');
    var inputHourAlias = $('#input-checkout-hour-alias');
    var oldHour = inputHourAlias.html();
    if( inputDate.length > 0 && inputHour.length > 0 && inputHourDefault.length > 0 ){
        var now = new Date();
        var dd = now.getDate();
        var mm = now.getMonth() + 1; //January is 0!

        var yyyy = now.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy;
        let defaultHour = inputHourDefault.html()
        body.on('change', '#input-checkout-date', function () {
            //console.log($(this).val());
            //console.log(today);
            //console.log($(this).val() == today);
            if ($(this).val() == today) {
                inputHour.html(oldHour);
            } else {
                inputHour.html(defaultHour);
            }
        });
    }

    /* apply checkout coupon */
    body.on('click', '#apply-voucher', function () {

        let parent = $(this).closest('.checkout-form');
        let url = $(this).attr('data-url');
        let voucherNo = $('#checkout-coupon-input').val();
        parent.addClass('is-loading');
        body.find('.coupon-message').html('').addClass('is-hidden');
        $.ajax({
            method: "post",
            url: url,
            data: {
                voucherNo: voucherNo,
                _token: config._token
            }
        })
        .done(function (resp) {
            parent.removeClass('is-loading');
            if (resp.status) {
                triggerCheckoutSummary(resp.summary);
            } else {
                console.log(resp.message);
                body.find('.coupon-message').html(resp.message).removeClass('is-hidden');
            }

        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
        });

        //return false;
    });

    /* remove checkout coupon */
    body.on('click', '#remove-voucher', function () {

        let parent = $(this).closest('.checkout-form');
        let url = $(this).attr('data-url');
        parent.addClass('is-loading');

        $.ajax({
            method: "post",
            url: url,
            data: {
                _token: config._token
            }
        })
        .done(function (resp) {
            parent.removeClass('is-loading');
            if ( resp.status ) {
                triggerCheckoutSummary(resp.summary);
            }
        })
        .fail(function (resp) {
            parent.removeClass('is-loading');
        });

        //return false;
    });

    let countdown = $(".countdown");
    if( countdown.length > 0 ){
        countdown.countdown(countdown.data('expired'), function(event) {
            let hour = $(this).find('.hour');
            let minute = $(this).find('.minute');
            let second = $(this).find('.second')

            let dayC = parseInt(event.strftime('%D'));
            let hourC = event.strftime('%H');
            if ( dayC >= 1 ){
                hourC = parseInt(hourC)+parseInt(24*dayC);
            }
            hour.text(hourC);
            minute.text(event.strftime('%M'));
            second.text(event.strftime('%S'));
            /*$(this).text(
                event.strftime('%D days %H:%M:%S')
            );*/
        });
    }

    var pageBlog = 2;
    $(document).on('click','.blog-view-more',function(e){

        e.preventDefault();

        let lastPage = $(this).data('last-page');
        let dataUrl = $(this).data('url');
        let parent = $(this).closest('.blog-overview');
        let s = $('input[name="s"]').val();

        parent.addClass('is-loading');

        $.ajax({
            url : dataUrl,
            method : "GET",
            data : {s: s, pageBlog:pageBlog},
            dataType : "text",
            success : function (data)
            {
                if(data != '') {
                    parent.find('.blog-overview-item:last').after(data);
                    console.log(parent);
                } else {
                    $('.blog-view-more').remove();
                }

                if ( pageBlog === lastPage ) {
                    $('.blog-view-more').remove();
                }

                parent.removeClass('is-loading');
                pageBlog++;
            }
        });
    });

    var pageCareer = 2;
    $(document).on('click','.career-view-more',function(e){

        e.preventDefault();

        let lastPage = $(this).data('last-page');
        let dataUrl = $(this).data('url');
        let parent = $(this).closest('.career-list');
        let s = $('input[name="s"]').val();
        let cp = $('input[name="cp"]').val();
        let cl = $('input[name="cl"]').val();

        parent.addClass('is-loading');

        $.ajax({
            url : dataUrl,
            method : "GET",
            data : {s: s, cl:cl, cp:cp, pageCareer:pageCareer},
            dataType : "text",
            success : function (data)
            {
                if(data != '') {
                    parent.find('.career-list-item:last').after(data);
                    console.log(parent);

                    $('.js-mfp-link').magnificPopup({
                        type: 'inline',
                        mainClass: 'mfp-animation',
                        removalDelay: 200,
                        showCloseBtn: false
                    });

                } else {
                    $('.career-view-more').remove();
                }

                if ( pageCareer === lastPage ) {
                    $('.career-view-more').remove();
                }

                parent.removeClass('is-loading');
                pageCareer++;
            }
        });
    });

    $('.checkout-payment-option').on('click change', function () {
        let payMethod = $(this).find('input[name="pay_method"]');
        let bankCd = payMethod ? payMethod.data('bank') : "";
        $('#input-payment-bankcd').val(bankCd)
    })

    /*
    * My Account
    * */
    var userContainer = $('.user-profile-container');
    if ( userContainer.length > 0 ){
        let orderNo = getParameterByName('no');
        if( orderNo ){
            $('.show-detail-order[data-no="'+ orderNo +'"]').addClass('is-toggled');
            $('.wrapper-detail-order[data-no="'+ orderNo +'"]').addClass('is-toggled').css({
                height: 'auto',
                visibility: 'inherit',
                opacity: 1,
                overflow: 'visible',
                display: 'block'
            })

        }
    }

    var fbBtn = $('.facebook-share-btn');

    // just load in single blog
    if( fbBtn.length > 0 ) {
        fbBtn.on('click', function () {
            var href = $(this).data('url');
            var image = $(this).data('image');
            var title = $(this).data('title');
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = 'https://www.facebook.com/sharer/sharer.php?sdk=joey&u=' + href + '&display=popup&ref=plugin&src=share_button',
                opts = 'status=1' +
                    ',width=' + width +
                    ',height=' + height +
                    ',top=' + top +
                    ',left=' + left;

            window.open(url, 'facebook', opts);
        });

        $('.twitter-share-btn').on('click', function () {
            var href = $(this).data('url');
            var title = $(this).data('title');
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = 'https://twitter.com/intent/tweet?url=' + href + '&text=' + title + '&wrap_links=‌​true',
                opts = 'status=1' +
                    ',width=' + width +
                    ',height=' + height +
                    ',top=' + top +
                    ',left=' + left;

            window.open(url, 'twitter', opts);
        });

        $('.google-share-btn').on('click', function () {
            var href = $(this).data('url');
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = 'https://plus.google.com/share?url=' + href,
                opts = 'status=1' +
                    ',width=' + width +
                    ',height=' + height +
                    ',top=' + top +
                    ',left=' + left;

            window.open(url, 'google', opts);
        });

        $('.linkedin-share-btn').on('click', function () {
            var href = $(this).data('url');
            var title = $(this).data('title');
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + href + '&title='+ title,
                opts = 'status=1' +
                    ',width=' + width +
                    ',height=' + height +
                    ',top=' + top +
                    ',left=' + left;

            window.open(url, 'linkedin', opts);
        });

    }

    /* prevent submit when enter */
    body.on('keydown', '.dont-enter', function(event){
        if( event.keyCode == 13 ) {
            event.preventDefault();
            return false;
        }
    });

    var parent = $(".resto-location-items");
    if( parent.length > 0 ) {
        var item = parent.find('.resto-location-item');
        if( parent.length > 0 ) {
            body.on('keyup', '#input-resto-search', function () {
                let filter = $(this).val().toUpperCase();
                for (i = 0; i < item.length; i++) {
                    let a = item[i].getElementsByClassName("name")[0];
                    let b = item[i].getElementsByClassName("address")[0];
                    let txtValue = a.textContent || a.innerText;
                    txtValue += b.textContent || b.innerText;

                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        item[i].style.display = "";
                    } else {
                        item[i].style.display = "none";
                    }
                }
            });
        }
    }

    body.on('click', '.map-finish-pinpoint', function () {

        let parentPopup = $(this).closest('.mfp-inline');
        let btnPopup = $('a[href="#'+ parentPopup.attr('id') +'"]');

        btnPopup.closest('form').submit();

        console.log(parentPopup);
        console.log(btnPopup);
        console.log(btnPopup.closest('form'));
    });

    /*body.on('click', '.save-address', function () {
        let form = $(this).closest('form');
        let lat = form.find('.checkout-user-lat');
        let lng = form.find('.checkout-user-lng');
        if( lat.val() == "" || lng.val() == "" ){
            alert("silahkan tandai pinpoint")
            return false;
        }

    });*/

    body.on('click', '.save-address', function () {
        let form = $(this).closest('form');

        let rmReqs = form.find('.rm-req');
        let error = 0;

        form.find('.error-address-input').remove();
        $.each( rmReqs , function(){
            if( $(this).val() == "" ){
                $(this).closest('.form-input-field').after('<span class="error-address-input alert">Harap diisi</span>');
                error += 1;
            }
        } );

        let rmReqCoords = form.find('.rm-req-coordinate');
        $.each( rmReqCoords , function(){
            if( $(this).val() == "" ){
                body.find('.form-pinpoint-field').after('<span class="error-address-input alert">Harap diisi</span>');
                error += 1;
            }
        } );

        if( error ){
            return false;
        }

        return true;
    });

    function validateOrder(form){

        let deliveryText = config.deliveryText;


        let rmReqs = form.find('.rm-req');
        let error = 0;

        let errorDefault = '';
        let errorPinpoint = '';

        form.find('.error-address-input').remove();
        $.each( rmReqs , function(){
            if( $(this).val() == "" ){
                $(this).closest('.form-input-field').after('<span class="error-address-input alert">Harap diisi</span>');
                error += 1;
                if( errorDefault == '' )
                    errorDefault = $(this).attr('id');
            }
        } );

        let shpMthd = $('.shp-method:checked').val();

        console.log(deliveryText);
        console.log(shpMthd);

        if( shpMthd === deliveryText ) {
            let rmReqCoords = form.find('.rm-req-coordinate');
            $.each(rmReqCoords, function () {
                if ($(this).val() == "") {
                    body.find('.form-pinpoint-field').after('<span class="error-address-input alert">Harap diisi</span>');
                    error += 1;
                    if( errorPinpoint == '' )
                        errorPinpoint = $(this).attr('id');
                }
            });
        }


        if( errorDefault != '' ){
            $('html, body').animate({
                scrollTop: $("#"+errorDefault).offset().top - 100
            }, 2000);
        } else if( errorPinpoint != '' ) {
            $('html, body').animate({
                scrollTop: $(".form-pinpoint-field").offset().top - 100
            }, 2000);
        }


        if( error ){
            return false;
        }


        return true;
    }

    body.on('click', '.alias-place-order', function () {
        console.log(1);
        let form = $('.form-checkout');
        $(this).text('Please wait ...')
            .attr('disabled','disabled');

        form.addClass('is-loading');

        form.submit();
    });
    /*body.on('click', '.place-order', function () {
        let form = $(this).closest('form');
        let result = validateOrder(form);

        $(this).text('Please wait ...')
            .attr('disabled','disabled');

        if( result == false ){
            $(this).text('Lanjut ke Pembayaran')
                .removeAttr('disabled');
            return false;
        }

        return true;
    });*/

    body.on('submit', '.form-checkout', function () {
        let form = $(this);
        let result = validateOrder(form);

        if( result == false ){
            form.removeClass('is-loading');
            $('.alias-place-order').text('Lanjut ke Pembayaran')
                .removeAttr('disabled');
            return false;
        }

        return true;
    });

    body.on('change', '.submit_on_change', function(){
        let form = $(this).closest('form');
        form.submit();
    });

    let vmap = getParameterByName('vmap');
    let inputResto = $('#input-resto-search');
    if( vmap && vmap != '' && inputResto.length > 0 ){
        inputResto.val(vmap).trigger('keyup');
        $('.resto-location-item:visible').find('.r-view-map').click();
        $('html, body').animate({
            scrollTop: $("#r-map-container").offset().top - 100
        }, 2000);

    }
});
