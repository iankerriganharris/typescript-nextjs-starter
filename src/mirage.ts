/* eslint-disable import/no-extraneous-dependencies */
import { createServer, Model, Factory, JSONAPISerializer } from 'miragejs';
import faker from 'faker';

const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const ApplicationSerializer = JSONAPISerializer.extend({
  keyForAttribute(attr) {
    return toCamelCase(attr);
  },
});

export function makeServer({ environment = `test` }) {
  return createServer({
    environment,

    models: {
      movie: Model,
      todo: Model,
    },

    serializers: {
      application: ApplicationSerializer,
    },

    factories: {
      movie: Factory.extend({
        title(i) {
          return `Movie ${i}`;
        },

        releaseDate() {
          return faker.date.past().toLocaleDateString();
        },

        genre(i) {
          const genres = [`Sci-Fi`, `Drama`, `Comedy`];

          return genres[i % genres.length];
        },
      }),
      todo: Factory.extend({
        text() {
          return `test`;
        },
        isDone() {
          return false;
        },
      }),
    },

    seeds(server) {
      server.createList(`movie`, 20);
      server.createList(`todo`, 5);
    },

    routes() {
      this.namespace = `api`;
      (this as any).resource(`movies`);
      (this as any).resource(`todos`);
    },
  });
}
