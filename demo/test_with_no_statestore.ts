/* This is a test does not make use of statestore.js to pass data from one function to the other */

type UserInfo = { username: string, fulname: string}
function App(){
    const data = { username: 'KBismark', fulname: 'Bismark Yamoah'};

    //Simulates userinfo after 2 secods
    setTimeout(() => {
        // Change username
        data.username = 'Kbis';
        // Show new user info
        ShowUserInfo(data);
    }, 2000);

    // Show current user info
    ShowUserInfo(data)
}

// Logs user info when user info is updated in the App method
function ShowUserInfo(props: UserInfo){
    SomeCPUIntensiveTask() // Performs some task
    console.log(props);
}

function SomeCPUIntensiveTask(){
    console.log('Performed some intensive task...');
}

// Start app
App();
