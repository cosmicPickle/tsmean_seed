import AppResource from './AppResource';

export class DefaultResource extends AppResource {
    protected defaultPath = '/'
}

export let defaultResource = new DefaultResource();