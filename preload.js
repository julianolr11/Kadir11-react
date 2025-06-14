const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js sendo executado');

// Expor o electronAPI com os canais IPC
contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        const validChannels = [
            'exit-app',
            'open-create-pet-window',
            'open-load-pet-window',
            'close-create-pet-window',
            'close-load-pet-window',
            'create-pet',
            'select-pet',
            'open-status-window',
            'care-pet',
            'battle-pet',
            'itens-pet',
            'store-pet',
            'train-pet',
            'open-battle-mode-window',
            'set-mute-state',
            'animation-finished' // Novo canal pra sinalizar o fim da animação
        ];
        if (validChannels.includes(channel)) {
            console.log(`Enviando canal IPC: ${channel}`, data);
            ipcRenderer.send(channel, data);
        } else {
            console.error(`Canal IPC não permitido: ${channel}`);
        }
    },
    on: (channel, callback) => {
        const validChannels = [
            'pet-data',
            'show-battle-error',
            'pet-created' // Novo canal pra receber a confirmação do pet criado
        ];
        if (validChannels.includes(channel)) {
            console.log(`Registrando listener para o canal: ${channel}`);
            ipcRenderer.on(channel, (event, ...args) => callback(event, ...args));
        } else {
            console.error(`Canal IPC não permitido para on: ${channel}`);
        }
    },
    createPet: (petData) => {
        console.log('Enviando create-pet via createPet:', petData);
        ipcRenderer.send('create-pet', petData);
    },
    onPetCreated: (callback) => {
        console.log('Registrando listener para pet-created');
        ipcRenderer.on('pet-created', (event, newPet) => callback(newPet));
    },
    animationFinished: () => {
        console.log('Enviando animation-finished');
        ipcRenderer.send('animation-finished');
    },
    listPets: () => {
        console.log('Enviando list-pets');
        return ipcRenderer.invoke('list-pets');
    },
    selectPet: (petId) => {
        console.log('Enviando select-pet:', petId);
        ipcRenderer.send('select-pet', petId);
    },
    deletePet: (petId) => {
        console.log('Enviando delete-pet:', petId);
        return ipcRenderer.invoke('delete-pet', petId);
    },
    closeCreatePetWindow: () => {
        console.log('Enviando close-create-pet-window');
        ipcRenderer.send('close-create-pet-window');
    },
    getMuteState: () => {
        console.log('Enviando get-mute-state');
        return ipcRenderer.invoke('get-mute-state');
    }
});

console.log('electronAPI exposto com sucesso');