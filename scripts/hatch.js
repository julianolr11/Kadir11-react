const hatchOverlay = document.getElementById('hatch-overlay');
const hatchVideo = document.getElementById('hatch-video');
const hatchName = document.getElementById('hatch-name');
const hatchGif = document.getElementById('hatch-gif');
const hatchInput = document.getElementById('hatch-name-input');
const hatchOk = document.getElementById('hatch-ok');
let hatchedPet = null;

function showHatchAnimation(newPet) {
    if (!hatchOverlay || !hatchVideo || !hatchName || !hatchGif || !hatchInput) return;
    hatchedPet = newPet;
    hatchGif.src = newPet.statusImage ? `Assets/Mons/${newPet.statusImage}` : (newPet.image ? `Assets/Mons/${newPet.image}` : 'Assets/Mons/eggsy.png');
    hatchInput.value = '';
    hatchName.style.display = 'none';
    hatchOverlay.style.display = 'flex';
    hatchVideo.style.display = 'block';
    const showName = () => {
        hatchVideo.style.display = 'none';
        hatchName.style.display = 'flex';
        hatchInput.focus();
    };
    setTimeout(showName, 7000);
}

window.addEventListener('DOMContentLoaded', () => {
    hatchOk?.addEventListener('click', () => {
        if (!hatchedPet) return;
        const name = hatchInput.value.trim();
        if (!name) return;
        if (name.length > 15) {
            alert('O nome do pet deve ter no máximo 15 caracteres!');
            return;
        }
        window.electronAPI.send('rename-pet', { petId: hatchedPet.petId, newName: name });
        hatchedPet = null;
        window.electronAPI.send('close-hatch-window');
    });

    hatchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            hatchOk.click();
        }
    });
});

window.electronAPI?.onPetCreated((newPet) => {
    showHatchAnimation(newPet);
});
