var totalRows = 3;


function createBoardTable()
{
    'use strict';
    $('#boardTbl').empty();
    for (let r = 0; r < totalRows; r++)
    {
        var tblRow = $("<tr>").attr('id', 'row_'+r);
        for (let c = 0; c < totalRows; c++)
        {
            var tblCol = $("<td>").data('row', r).data('col', c);
            tblRow.append(tblCol);
        }
        $('#boardTbl').append(tblRow);
    }
}

function initGame()
{
    createBoardTable();
}

function initPreGame()
{
    var requestedRows = parseInt($("#rowsCount").val());
    if ((isNaN(requestedRows)) || (requestedRows < 3 || requestedRows > 9))
    {
        alert("Requested row is set to '3' by default.");
        totalRows = 3;
    }
    else
    {
        totalRows = requestedRows;
    }
    $('#game').show();
    initGame();
}

$(function(){
    
    initPreGame();
    /*
    $('#preModal').on('hidden.bs.modal', function () {
        initPreGame();
    }).modal({
        keyboard: false
    });
    
    $('#game').hide();
    
    $("#goBtn").on('click', function(ev) {
        $("#preModal").modal('hide');
        ev.preventDefault();
    });
    */
});
