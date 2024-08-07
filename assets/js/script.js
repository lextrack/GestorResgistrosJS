var itemsPerPage = 5;
var currentPage = 1;
var totalPages = 5;

function validateForm(){
    var articulo = document.getElementById("articulo").value;
    var cantidad = document.getElementById("cantidad").value;
    var precio = document.getElementById("precio").value;
    var proveedor = document.getElementById("proveedor").value;
    var fecha = document.getElementById("fecha").value;

    if(articulo == ""){
        //Ver si hay alguna forma que no sea necesario validar nada y que se puedan llegar a insertar registros vacios
        alert("Debes indicar el nombre del artículo");
        return false;
    }
    return true;
}

function selectCategoria(categoria) {
    document.getElementById("categoria").value = categoria;

    document.getElementById("dropdownCategoria").innerHTML = categoria;
}

function formatCurrency(value) {
    return parseFloat(value).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

function formatInputPrice(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 0) {
        formattedValue = parseInt(value).toLocaleString('es-CL');
    }

    input.value = formattedValue;
}

function formatDate(dateString) {
    if (!dateString || dateString.trim() === '') {
        return 'Sin fecha';
    }
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function showData() {
    var productList;
    if (localStorage.getItem("productList") == null) {
        productList = [];
    } else {
        productList = JSON.parse(localStorage.getItem("productList"));
    }

    //Mucho muy importante este orden
    productList.reverse();

    totalPages = Math.ceil(productList.length / itemsPerPage);

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var displayedProducts = productList.slice(startIndex, endIndex);

    var html = "";
    var totalSum = 0;
    displayedProducts.forEach(function (element, index) {
        let originalIndex = productList.length - 1 - (startIndex + index);
        html += "<tr>";
        html += "<td>" + element.articulo + "</td>";
        html += "<td>" + element.cantidad + "</td>";
        html += "<td>" + formatCurrency(element.precio) + "</td>";
        html += "<td>" + formatCurrency(element.total) + "</td>";
        html += "<td>" + element.proveedor + "</td>";
        html += "<td>" + formatDate(element.fecha) + "</td>";
        html += "<td>" + element.categoria + "</td>";
        html +=
            '<td><button onclick="deleteData(' +
            originalIndex +
            ')" class="btn btn-danger">Borrar</button><button onclick="updateData(' +
            originalIndex +
            ')" class="btn btn-warning m-1">Editar</button></td>';
        html += "</tr>";

        totalSum += parseFloat(element.total);
    });

    document.querySelector("#crudTable tbody").innerHTML = html;
    calculateTotalSum();

    let paginationHtml = '<button class="btn btn-danger" onclick="changePage(' + (currentPage - 1) + ')" ' + (currentPage === 1 ? 'disabled' : '') + '>&lt;</button>';
    paginationHtml += '<button class="btn btn-danger" onclick="changePage(1)">Primero</button>';
    if (totalPages > 5) {
        let startPage = currentPage - 2;
        let endPage = currentPage + 2;
        if (startPage < 1) {
            startPage = 1;
            endPage = 5;
        } else if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - 4;
        }
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + i + ')" ' + (currentPage === i ? 'style="background-color: #7a2640"' : '') + '>' + i + '</button>';
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + i + ')" ' + (currentPage === i ? 'style="background-color: #7a2640"' : '') + '>' + i + '</button>';
        }
    }
    paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + totalPages + ')">Último</button>';
    paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + (currentPage + 1) + ')" ' + (currentPage === totalPages ? 'disabled' : '') + '>&gt;</button>';

    document.querySelector("#pagination").innerHTML = paginationHtml;
}

document.addEventListener('DOMContentLoaded', (event) => {
    showData();
});

function changePage(newPage) {
    if (newPage < 1) {
        currentPage = 1;
    } else if (newPage > totalPages) {
        currentPage = totalPages;
    } else {
        currentPage = newPage;
    }
    showData();
}

function AddData() {
    if (validateForm()) {
        var articulo = document.getElementById("articulo").value;
        var cantidad = document.getElementById("cantidad").value;
        var precio = parseFloat(document.getElementById("precio").value.replace(/\./g, '').replace(',', '.'));
        var proveedor = document.getElementById("proveedor").value;
        var fecha = document.getElementById("fecha").value;
        var total = parseInt(cantidad) * precio;
        var categoria = document.getElementById("categoria").value;

        var productList;
        if (localStorage.getItem("productList") == null) {
            productList = [];
        } else {
            productList = JSON.parse(localStorage.getItem("productList"));
        }

        //No se si va aquí pero mostrarle al usuario que fue weon y no puso fecha
        formatDate();

        productList.push({
            articulo: articulo,
            cantidad: cantidad,
            precio: precio,
            proveedor: proveedor,
            fecha: fecha,
            total: total,
            categoria: categoria
        });

        localStorage.setItem("productList", JSON.stringify(productList));
        showData();

        document.getElementById("articulo").value = "";
        document.getElementById("cantidad").value = "0";
        document.getElementById("precio").value = "0";
        document.getElementById("total").value = "";
        document.getElementById("proveedor").value = "";
        document.getElementById("fecha").value = "";
        document.getElementById("categoria").value = ""; 

        document.getElementById("dropdownCategoria").innerHTML = "Seleccionar Categoría";

        calculateTotalSum();
    }
}

function deleteData(index){
    var productList;
    if(localStorage.getItem("productList") == null){
        productList = [];
    }
    else{
        productList = JSON.parse(localStorage.getItem("productList"));
    }

    productList.splice(index, 1);
    localStorage.setItem("productList", JSON.stringify(productList));
    showData();
    calculateTotalSum();
}

function updateData(index){
    document.getElementById("Submit").style.display = "none";
    document.getElementById("Update").style.display = "block";

    document.getElementById("cantidad").addEventListener("input", updateTotal);
    document.getElementById("precio").addEventListener("input", updateTotal);

    var productList;
    if(localStorage.getItem("productList") == null){
        productList = [];
    }
    else{
        productList = JSON.parse(localStorage.getItem("productList"));
    }
    
    document.getElementById("articulo").value = productList[index].articulo;
    document.getElementById("cantidad").value = productList[index].cantidad;
    document.getElementById("precio").value = productList[index].precio;
    document.getElementById("total").value = productList[index].total;
    document.getElementById("proveedor").value = productList[index].proveedor;
    document.getElementById("fecha").value = productList[index].fecha;
    document.getElementById("categoria").value = productList[index].categoria;

    document.querySelector("#Update").onclick = function(){

        if(validateForm() == true){
            productList[index].articulo = document.getElementById("articulo").value;
            productList[index].cantidad = document.getElementById("cantidad").value;
            productList[index].precio = parseFloat(document.getElementById("precio").value.replace(/\./g, '').replace(',', '.'));
            productList[index].total = parseInt(document.getElementById("cantidad").value) * productList[index].precio;
            productList[index].proveedor = document.getElementById("proveedor").value;
            productList[index].fecha = document.getElementById("fecha").value;
            productList[index].categoria = document.getElementById("categoria").value;

            localStorage.setItem("productList", JSON.stringify(productList));

            showData();

            document.getElementById("articulo").value = "";
            document.getElementById("cantidad").value = "0";
            document.getElementById("precio").value = "0";
            document.getElementById("total").value = "";
            document.getElementById("proveedor").value = "";
            document.getElementById("fecha").value = "";

            document.getElementById("dropdownCategoria").innerHTML = "Seleccionar Categoría";

            document.getElementById("Submit").style.display = "block";
            //Revisar que el botón no se atasque como al principio del desarrollo
            document.getElementById("Update").style.display = "none";
        }
    }
}

function calculateTotalSum() {
    var productList;
    if (localStorage.getItem("productList") == null) {
        productList = [];
    } else {
        productList = JSON.parse(localStorage.getItem("productList"));
    }
    //Revisar si se suma, antes no tomaba los decimales
    var totalSum = productList.reduce((sum, product) => sum + parseFloat(product.total), 0);
    document.getElementById("totalSum").innerText = totalSum.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

function updateTotal(){
    var cantidad = document.getElementById("cantidad").value;
    var precio = parseFloat(document.getElementById("precio").value.replace(/\./g, '').replace(',', '.'));
    document.getElementById("total").value = parseInt(cantidad) * precio;
}

// Come on, do a flip
function searchData() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    var productList = JSON.parse(localStorage.getItem("productList")) || [];

    var searchedProducts = productList.filter(function (articulo) {
        return (
            articulo.articulo.toLowerCase().includes(searchInput) ||
            articulo.proveedor.toLowerCase().includes(searchInput)
        );
    });

    if (searchInput === "") {
        showData();
        return;
    }

    totalPages = Math.ceil(searchedProducts.length / itemsPerPage);
    currentPage = 1;

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var displayedProducts = searchedProducts.slice(startIndex, endIndex);

    var html = "";
    displayedProducts.forEach(function (element, index) {
        html += "<tr>";
        html += "<td>" + element.articulo + "</td>";
        html += "<td>" + element.cantidad + "</td>";
        html += "<td>" + formatCurrency(element.precio) + "</td>";
        html += "<td>" + formatCurrency(element.total) + "</td>";
        html += "<td>" + element.proveedor + "</td>";
        html += "<td>" + formatDate(element.fecha) + "</td>";
        html += "<td>" + element.categoria + "</td>";
        html +=
            '<td><button onclick="deleteData(' +
            index +
            ')" class="btn btn-danger">Borrar</button><button onclick="updateData(' +
            index +
            ')" class="btn btn-warning m-1">Editar</button></td>';
        html += "</tr>";
    });
    document.querySelector("#crudTable tbody").innerHTML = html;

    //Aquí y no en HTML, crack?
    let paginationHtml = '<button class="btn btn-danger" onclick="changePage(' + (currentPage - 1) + ')" ' + (currentPage === 1 ? 'disabled' : '') + '>&lt;</button>';
    paginationHtml += '<button class="btn btn-danger" onclick="changePage(1)">Primero</button>';
    if (totalPages > 5) {
        let startPage = currentPage - 2;
        let endPage = currentPage + 2;
        if (startPage < 1) {
            startPage = 1;
            endPage = 5;
        } else if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - 4;
        }
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + i + ')" ' + (currentPage === i ? 'style="background-color: #7a2640"' : '') + '>' + i + '</button>';
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + i + ')" ' + (currentPage === i ? 'style="background-color: #7a2640"' : '') + '>' + i + '</button>';
        }
    }
    paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + totalPages + ')">Último</button>';
    paginationHtml += '<button class="btn btn-danger" onclick="changePage(' + (currentPage + 1) + ')" ' + (currentPage === totalPages ? 'disabled' : '') + '>&gt;</button>';

    document.querySelector("#pagination").innerHTML = paginationHtml;
}

//Un software empieza por una planilla Excel y termina en una planilla Excel
function exportToExcel() {
    var productList = JSON.parse(localStorage.getItem("productList")) || [];

    productList.forEach(function(product) {
        if (product.fecha) { 
            var date = new Date(product.fecha);
            var day = String(date.getDate()).padStart(2, '0');
            var month = String(date.getMonth() + 1).padStart(2, '0'); //El mes empieza por 0
            var year = date.getFullYear();
            product.fecha = day + '-' + month + '-' + year;
        }
    });

    var worksheet = XLSX.utils.json_to_sheet(productList);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DatosTransacciones');

    var currentDate = new Date();
    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();
    var dateFormatted = day + '-' + month + '-' + year;

    var fileName = 'DatosTransacciones_' + dateFormatted + '.xlsx';

    XLSX.writeFile(workbook, fileName);
}

//Necesario porque no soy capaz de subir esta app a un servidor
function exportToJSON() {
    var productList = JSON.parse(localStorage.getItem("productList")) || [];
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(productList));

    var currentDate = new Date();
    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();
    var hours = String(currentDate.getHours()).padStart(2, '0');
    var minutes = String(currentDate.getMinutes()).padStart(2, '0');
    var seconds = String(currentDate.getSeconds()).padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;

    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "Respaldo_" + formattedDate + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importFromJSON(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var jsonData = JSON.parse(event.target.result);
        localStorage.setItem("productList", JSON.stringify(jsonData));
        showData();
    };
    reader.readAsText(file);
}