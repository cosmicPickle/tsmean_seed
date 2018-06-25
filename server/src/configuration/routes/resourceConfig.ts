import { userResource } from './../../resource/user';
import { groupResource } from './../../resource/group';
import { defaultResource } from './../../core/routing/DefaultResource';
import AppResource from './../../core/routing/AppResource';

export const resourceConfig: AppResource[] = [
    defaultResource,
    userResource,
    groupResource,
];

export default resourceConfig;