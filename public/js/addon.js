
/* Info Modelbox Design Start*/
// Add events to dialog trigger elements
$(document).on('click', ".item-info", function () {
    // get data
    var data = $(this).data();
    var itemArrow = ' <i class="aui-icon aui-icon-small aui-iconfont-arrows-down"></i> ';

    // set data
    var itemModule = data.module;
    var itemName = data.name;
    var itemPath = data.path == '' ? '' : replaceAll(data.path, '->', itemArrow);
    var itemStereotype = data.stereotype;
    var itemAuthor = data.author;
    var itemModified = data.date;

    itemPath = itemPath + (itemModule == "Diagram" || itemModule == "Package" ? "" : itemArrow + itemName);

    // define dialogue
    // Standard sizes are 400, 600 and 840 pixels wide
    var dialog = new AJS.Dialog({
        width: 640,
        height: 350,
        id: "info-dialog",
        closeOnOutsideClick: false
    });
    // add header
    dialog.addHeader(itemModule + " Info");
    // add panel
    var panelHTML = '<ul class="info-details">' +
        '<li><p class="text-label">Name:</p><p class="label-info">' + itemName + '</p></li>' +
        '<li><p class="text-label">Path:</p><p class="label-info">' + itemPath + '</p></li>' +
        '<li><p class="text-label">Stereotype:</p><p class="label-info">' + itemStereotype + '</p></li>' +
        '<li><p class="text-label">Author:</p><p class="label-info">' + itemAuthor + '</p></li>' +
        '<li><p class="text-label">Last Modified:</p><p class="label-info">' + itemModified + '</p></li>' +
        '</ul>';
    dialog.addPanel("Panel", panelHTML, "panel-body");
    // add "Cancel"
    dialog.addButton("Close", function (dialog) { dialog.remove(); }); // remove dialogue on close

    // start first page, first panel
    dialog.gotoPage(0);
    dialog.gotoPanel(0);
    // show  dialogue
    dialog.show();

    // update height
    dialog.updateHeight();
});
/* Info Modelbox Design End*/

//For List Selection
$(document).on('click',".filter-list > ul > li .filter-item-wrap",function() {  
    $(this).closest('ul').find('.dialog-active').removeClass('dialog-active');
    $(this).addClass('dialog-active');
});

