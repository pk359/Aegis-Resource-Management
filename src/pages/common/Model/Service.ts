export enum ServiceCategory {
    POTATO, TOMATO, BANANA
}
export class Service {
    name: String;
    category: ServiceCategory = ServiceCategory.POTATO

    constructor(name) {
        this.name = name;
    }
}