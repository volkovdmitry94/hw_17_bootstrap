(()=>{
    const inputs = [
        'dest_city', 'dest_country',
        'budget_value', 'start_date',
        'end_date', 'persons',
        'transfer_type'];

    const listRoot = document.getElementById("list_root");
    const localList = localStorage.getItem('data_travels');
    const database = (localList)?JSON.parse(localList):[];

    // Save button
    document.getElementById("btn_save").addEventListener('click',()=>{
        const dataObject = inputs.reduce((accumulator, value)=>{
            console.log(document.getElementById(value).value);
            accumulator[value] = document.getElementById(value).value;
            return accumulator;
        },{});
        dataObject.added_date = Date.now();

        database.push(dataObject);
        inputs.forEach((value=>{
            document.getElementById(value).value = "";
        }));
        console.log(database);
        localStorage.setItem('data_travels',JSON.stringify(database));
        render();
    });

    // Render database state
    const render = ()=>{
        listRoot.innerHTML = database.map((value, index)=>{
            return `
                <div class="card travel-card">
                    <div class="title">
                        <h4>From Haifa to ${value['dest_city']}/${value['dest_country']}</h4>
                        <i class="bi bi-pencil-square edit" user_id="${index}"></i>
                        <i class="bi bi-x-circle remove" user_id="${index}"></i>
                        <i class="bi bi-three-dots-vertical details" user_id="${index}"></i>
                    </div>
                    <span>Expected budget: ${value['budget_value']} ILS</span>
                    <span>${value['start_date']} - ${value['end_date']} | ${value['persons']} persons | ${value['transfer_type']}</span>
                </div>
            `;
        }).join("");
        setUpIcons();
    }

    // Icons behavior setup
    const setUpIcons = () => {
        document.querySelectorAll('.travel-card').forEach(value => {
            value.addEventListener('click', (element) => {
                if (element.target.classList.contains('edit')) editTravel(element);
                else if (element.target.classList.contains('remove')) deleteTravel(element);
                else if (element.target.classList.contains('details')) showTravelDetail(element);
            });
        });
    }

    const deleteTravel = value => {
        const id = Number(value.target.getAttribute('user_id'));
        console.log("edit - "+id);
        database.splice(id, 1);
        localStorage.setItem('data_travels',JSON.stringify(database));
        render();
    }

    const editTravel = value =>  {
        const id = Number(value.target.getAttribute('user_id'));
        console.log("edit - "+id);

        //Modal components
        const modalEdit = new bootstrap.Modal(document.getElementById('modalEdit'));
        document.getElementById('modalEditBody').innerHTML = `
                <div class="card add-travel-card" id="edit_card">
                    <input type="text" class="form-control" id="dest_city_edit" placeholder="City" 
                    value="${database[id]['dest_city']}">
                    <input type="text" class="form-control" id="dest_country_edit" placeholder="Country"
                    value="${database[id]['dest_country']}">
                    <input type="number" class="form-control" id="budget_value_edit" placeholder="Budget"
                    value="${database[id]['budget_value']}">
                    <div><label for="start_date_edit">Date start</label></div>
                    <input type="date" class="form-control" id="start_date_edit" placeholder="Date start"
                    value="${database[id]['start_date']}">
                    <div><label for="end_date_edit">Date end</label></div>
                    <input type="date" class="form-control" id="end_date_edit" placeholder="Date end"
                    value="${database[id]['end_date']}">
                    <div><label for="persons_edit">Persons:</label></div>
                    <select id="persons_edit" class="form-control">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value=">7">>7</option>
                    </select>
                    <div><label for="transfer_type_edit">Main transfer type:</label></div>                
                    <select id="transfer_type_edit" class="form-control">
                        <option value="def">---</option>
                        <option value="car">Private car</option>
                        <option value="bus">Bus</option>
                        <option value="railway">Railway</option>
                        <option value="fly">Fly</option>
                        <option value="rent_cat">Rent car</option>
                        <option value="taxi">Taxi</option>
                    </select>
                    <button class="btn btn-success btn-save-travel" id="btn_save_edit">Save travel</button>
                </div>`;
        document.getElementById('persons_edit').value = database[id]['persons'];
        document.getElementById('transfer_type_edit').value = database[id]['transfer_type'];
        modalEdit.show();

        // Initialization of new values
        document.getElementById('btn_save_edit').addEventListener('click', () => {
            database[id]['dest_city'] = document.getElementById('dest_city_edit').value;
            database[id]['dest_country'] = document.getElementById('dest_country_edit').value;
            database[id]['budget_value'] = document.getElementById('budget_value_edit').value;
            database[id]['start_date'] = document.getElementById('start_date_edit').value;
            database[id]['end_date'] = document.getElementById('end_date_edit').value;
            database[id]['persons'] = document.getElementById('persons_edit').value;
            database[id]['transfer_type'] = document.getElementById('transfer_type_edit').value;
            modalEdit.hide();
            localStorage.setItem('data_travels',JSON.stringify(database));
            render();
        });
    }

    const showTravelDetail = value => {
        const id = Number(value.target.getAttribute('user_id'));
        console.log("details - "+id);
        const modalDetails = new bootstrap.Modal(document.getElementById('modalDetails'));
        document.getElementById('modalDetailsBody').innerHTML = `
                <div>City: ${database[id]['dest_city']}</div>
                <div>Country: ${database[id]['dest_country']}</div>
                <div>Expected budget: ${database[id]['budget_value']}</div>
                <div>Date start: ${database[id]['start_date']}</div>
                <div>Date end: ${database[id]['end_date']}</div>
                <div>Persons: ${database[id]['persons']}</div>
                <div>Main transfer type: ${database[id]['transfer_type']}</div>`;
        modalDetails.show();
    }

    // Sort array
    const sort = document.getElementById("sort_type");
    sort.addEventListener('click',() => {
        switch (sort.value) {
            case 'date_added':
                database.sort((object1, object2) => {
                    return object1.added_date - object2.added_date;
                });
                break;
            case 'budget':
                database.sort((object1, object2) => {
                    return object1.budget_value - object2.budget_value;
                });
                break;
            case 'date':
                database.sort((object1, object2) => {
                    if (object1.start_date > object2.start_date) return 1;
                    if (object1.start_date === object2.start_date) return 0;
                    if (object1.start_date < object2.start_date) return -1;
                });
                break;
            case 'persons':
                database.sort((object1, object2) => {
                    if (object1.persons > object2.persons) return 1;
                    if (object1.persons === object2.persons) return 0;
                    if (object1.persons < object2.persons) return -1;
                });
                break;
        }
        render();
    });

    // Initial render
    render();
})();