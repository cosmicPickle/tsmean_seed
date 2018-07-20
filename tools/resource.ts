#!/usr/bin/env node 
import * as fs from 'fs';
import { resourceTemplates, ResourceTemplate } from './resourceTemplates';
import * as pluralize from 'pluralize';

class Directory {

    protected children: Directory[] = [];
    protected files: DirectoryFile[] = [];
    constructor(protected path: string) {};
    addChild(child: Directory) {
        this.children.push(child);
        return this;
    }
    addFile(file: DirectoryFile) {
        this.files.push(file);
        return this;
    }
    create(root:string = '') {
        if(!fs.existsSync(root + this.path))
            fs.mkdirSync(root + this.path);

        if(this.files.length)
            for(let i = 0; i < this.files.length; i++) 
                this.files[i].create(root + this.path);

        if(this.children.length)
            for(let i = 0; i < this.children.length; i++) 
                this.children[i].create(root + this.path);
    }
}

class DirectoryFile extends Directory {
    protected baseTemplatePath = './tools/resource/';
    constructor(protected path: string, protected template: ResourceTemplate) {
        super(path);
    }
    create(root:string = '') {
         if(!fs.existsSync(root + this.path))
            fs.writeFileSync(root + this.path, this.template.get())
    }
}

export class Resource {
    protected resourcePath = './server/src/resource/';
    protected name = process.argv[3];
    protected tree: Directory;

    constructor() {
        this.tree = new Directory(this.resourcePath + this.name + '/')
                    .addFile(new DirectoryFile('index.ts', resourceTemplates.resourceIndex.parse({ 
                        namePascalCase: this.namePascalCase() 
                    })))
                    .addFile(new DirectoryFile(this.namePascalCase() + 'Resource.ts', resourceTemplates.resource.parse({ 
                        name: this.name,
                        path: this.nameToPath(),
                        namePascalCase: this.namePascalCase() 
                    })))
                    .addChild(new Directory('middlewares/')
                                .addFile(new DirectoryFile('index.ts', resourceTemplates.middlewaresIndex.parse({
                                    name: this.name,
                                    namePascalCase: this.namePascalCase()
                                })))
                                .addFile(new DirectoryFile(
                                    this.namePascalCase() + 'RouteValidatorMiddleware.ts', 
                                    resourceTemplates.routeValidatorMiddleware.parse({
                                        name: this.name,
                                })))
                            )
                    .addChild(new Directory('models/')
                                .addFile(new DirectoryFile('index.ts', resourceTemplates.modelsIndex.parse({})))
                                .addChild(new Directory('mongo/')
                                            .addFile(new DirectoryFile('index.ts', resourceTemplates.mongoIndex.parse({ 
                                                namePascalCase: this.namePascalCase() 
                                            })))
                                            .addFile(new DirectoryFile(
                                                'I' + this.namePascalCase() + 'MongoModel.ts', 
                                                resourceTemplates.iMongoModel.parse({ 
                                                    namePascalCase: this.namePascalCase() 
                                            })))
                                            .addFile(new DirectoryFile(
                                                this.namePascalCase() + 'MongoModel.ts', 
                                                resourceTemplates.mongoModel.parse({ 
                                                    name: this.name,
                                                    namePascalCase: this.namePascalCase(),
                                                    namePlural: this.namePlural()
                                            })))
                                        )
                                .addChild(new Directory('validation/')
                                            .addFile(new DirectoryFile(
                                                'index.ts', 
                                                resourceTemplates.validationIndex.parse({ 
                                                    namePascalCase: this.namePascalCase(),
                                            })))
                                            .addFile(new DirectoryFile(
                                                this.namePascalCase() + 'ValidationSchema.ts', 
                                                resourceTemplates.validationSchema.parse({ 
                                                    name: this.name,
                                                    namePascalCase: this.namePascalCase(),
                                            })))
                                            .addFile(new DirectoryFile(
                                                this.namePascalCase() + 'ValidationSchemaTypes.ts', 
                                                resourceTemplates.validationSchemaTypes.parse({ 
                                                    namePascalCase: this.namePascalCase(),
                                            })))
                                        )
                            )
    }
    generate() {
        if (fs.existsSync(this.resourcePath + this.name)){
            return console.error("Resource exists!");
        } 

        if(!/^[a-zA-Z0-9]+$/.test(this.name)){
            console.error('The name of the resource must be camel case.');
            return;
        }

        this.name = this.nameNormalize();
        this.tree.create();
    }

    protected nameNormalize() {
        return this.name.slice(0,1).toLowerCase() + this.name.slice(1);
    }

    protected namePascalCase() {
        return this.name.slice(0,1).toUpperCase() + this.name.slice(1);
    }

    protected nameToPath() {
        return `/${this.name}/:_id?`
    }

    protected namePlural() {
        return pluralize(this.name);
    }
}

if(parseInt(process.argv[2]) === 1)
    new Resource().generate();