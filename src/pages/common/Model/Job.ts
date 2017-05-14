export class Job {
    key: string = '';
    clientName: string = '';
    clientUid: string = '';
    serviceList = [];
    description: string = '';
    room: string = '';
    building: string = '';
    placedOn: string = '';
    completed: boolean = false;
    photosByClient = [];
    progress = {
        aegisApproved: { status: false },
        tpAssigned: { status: false, workers: [] },
        checkedIn: { status: false },
        photosBefore: { status: false, photos: [] },
        photosAfter: { status: false, photos: [] },
        tpDone: { status: false },
        clientApproved: { status: false },
        invoiceSent: { status: false },
        followUp: [{ author: '', message: '' }]
    }
}
