import { userResource } from './../../resource/user';
import { groupResource } from './../../resource/group';
import AppResource from './../../core/routing/AppResource';

export const resourceConfig: AppResource[] = [
    userResource,
    groupResource
];

export default resourceConfig;