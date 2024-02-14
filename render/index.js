const xlsx = require('xlsx');
let wb;

function extractInfo(sheet, tmpl) {
    let maxRow = parseInt(sheet['!ref'].match(/\w\d+:\w(\d+)/)[1]);
    let outRow = [];
    for (let rowIndex of Array(maxRow).keys()) {
        rowIndex += 1;
        if (useFilter(sheet, rowIndex)) {
            outRow.push(rowIndex);
        }
    }
    let output = '';
    for (const rowIndex of outRow) {
        output += eval(tmpl);
    }
    $('#output').text(output);
}

function parseTmpl() {
    const tmpl = $('#tmpl').val();
    localStorage.setItem('template', tmpl);
    return '`' + tmpl.replace(/\[(.*?)]/g, '${getCell(sheet, "$1",rowIndex)}') + '\n\n`';
}

const useFilter = (sheet, rowIndex) =>
    filters.every(f => {
        if (!f.col || !f.content) return true;
        let re = new RegExp(f.content, 'g');
        const cell = sheet[`${f.col}${rowIndex}`];
        return !!(cell && cell.v.toString().match(re));
    });

function saveFilter() {
    filters = localStorage.getItem('filters') ? JSON.parse(localStorage.getItem('filters')) : [{}];

    filters.slice(1).forEach(() => {
        addFilter();
    });
    $('.filter-col').each(function (idx, el) {
        $(el).val(filters[idx].col);
    });
    $('.filter-content').each(function (idx, el) {
        $(el).val(filters[idx].content);
    });
    $(document).on('keyup', '.filter-col', e => {
        e.target.value = e.target.value.toUpperCase();
        $('.filter-col').each(function (idx, el) {
            filters[idx].col = el.value;
        });
        localStorage.setItem('filters', JSON.stringify(filters));
    });
    $(document).on('keyup', '.filter-content', () => {
        $('.filter-content').each(function (idx, el) {
            filters[idx].content = el.value;
        });
        localStorage.setItem('filters', JSON.stringify(filters));
    });
}

function addFilter(push = false) {
    $('#filter-container').append(`<div class="filter row my-2">
                     <div class="col-1">
                        <input type="text" class="filter-col form-control" maxlength="1"
                               style="text-transform: capitalize">
                    </div>
                    <div class="col">
                        <input type="text" class="filter-content form-control">
                    </div>
                    <div class="col-auto">
                        <button type="button" class="remove-filter" style="color: crimson">-</button>
                    </div>
                </div>`);
    if (push) filters.push({});
}

function removeFilter(e) {
    const index = $('.filter').index($(e.target).parents('.filter'));
    $(e.target).parents('.filter').remove();
    filters.splice(index, 1);
    localStorage.setItem('filters', JSON.stringify(filters));
}

window.onload = () => {
    let sheetChosen;

    $('#tmpl').val(localStorage.getItem('template') ? localStorage.getItem('template') : '');
    $('#file-input').change((e) => {
        wb = xlsx.readFile(e.target.files[0].path);
        const chooseSheetBtn = $('#choose-sheet-btn');
        chooseSheetBtn.removeAttr('disabled');
        $('#sheet-options li').remove();
        for (const sheet of wb.SheetNames) {
            $('#sheet-options').append(`<li><a href="#" class="dropdown-item" id="${sheet}">${sheet}</a></li>`);
        }
        sheetChosen = null;
        chooseSheetBtn.text('Sheet name');
        $('#extract').attr('disabled', true);

    });
    $('#sheet-options').click((e) => {
        sheetChosen = e.target.id;
        $('#extract').prop('disabled', false);
        $('#choose-sheet-btn').text(sheetChosen);
    });
    $('#extract').click(() => extractInfo(wb.Sheets[sheetChosen], parseTmpl()));
    $('#tmpl-btn').click(() => $('#tf-container').toggle());
    saveFilter();
    $('.add-filter').click(() => addFilter(push = true));
    $(document).on('click', '.remove-filter', e => removeFilter(e));


};