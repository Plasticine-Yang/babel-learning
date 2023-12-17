import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('package', {
    description: 'Add a new package',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message: 'What is the name of the new package?',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/babel-plugin-{{kebabCase packageName}}',
        templateFiles: 'templates/babel-plugin-package',
        base: 'templates/babel-plugin-package',
      },
    ],
  })
}
