<template>
  <div>
    <div>
      <button @click="onDisConnectButtonClicked">
        {{ socket.connected ? 'Disconnect' : 'Connect' }}
      </button>
    </div>
    <div v-if="socket.connected">
      <select v-model="method">
        <option value="application_operations_post">POST</option>
        <option value="application_operations_get">GET</option>
        <option value="application_operations_put">UPDATE</option>
        <option value="application_operations_delete">DELETE</option>
      </select>
      <input type="text" placeholder="Collection" v-model="collection" />
      <textarea
        cols="50"
        rows="10"
        placeholder="Data"
        v-if="
          method == 'application_operations_post' ||
          method == 'application_operations_put'
        "
        v-model="data"
      ></textarea>
      <textarea
        cols="50"
        rows="10"
        placeholder="User Permissions Array"
        v-if="method == 'application_operations_post'"
        v-model="userPermissions"
      ></textarea>
      <textarea
        cols="50"
        rows="10"
        placeholder="Query"
        v-if="method == 'application_operations_get'"
        v-model="query"
      ></textarea
      ><input
        type="text"
        placeholder="Fields"
        v-if="method == 'application_operations_get'"
        v-model="fieldsString"
      />
      <label for="includeFieldsId" v-if="method == 'application_operations_get'"
        >Include Fields (True = Include, False = Exclude)</label
      >
      <input
        id="includeFieldsId"
        type="checkbox"
        v-model="includeFields"
        v-if="method == 'application_operations_get'"
      />
      <input
        type="text"
        placeholder="Object ID"
        v-if="
          method == 'application_operations_put' ||
          method == 'application_operations_delete'
        "
        v-model="objectId"
      />
      <button @click="onSendMessageButtonClicked">Send</button>
      <div>
        <br />
        <br />
        <label>Response Message</label>
        <p>
          {{ result ? JSON.parse(result) : 'No Result' }}
        </p>
        <hr />
        <label>Database</label>
        <p v-if="!saving">
          {{
            database['my_test_collection']
              ? database['my_test_collection'].items
              : ''
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { io, Socket } from 'socket.io-client';
import { LocalStorageDb } from 'minimongo';
import { ResponseMessage } from '../../../../mgmtconsole/node_modules/@backend/messagehandler';

@Component
export default class WebSocketPage extends Vue {
  protected socket: Socket = io('wss://192.168.178.36:8086', {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling', 'flashsocket'],
  });

  protected method: string = 'application_operations_post';

  protected collection: string = 'my_test_collection';

  protected data: string = '';

  protected userPermissions: string = '';

  protected query: string = '';

  protected fieldsString: string = '';

  protected includeFields: boolean = false;

  protected objectId: string = '';

  protected result: string = '';

  protected database: any = new LocalStorageDb();

  protected saving: boolean = false;

  protected onDisConnectButtonClicked() {
    if (this.socket.connected) {
      this.socket.disconnect();
      this.socket.off('message');
      this.socket.off('update');

      return;
    }

    this.socket.connect();
    this.socket.on('message', (message: string) => {
      this.result = JSON.parse(JSON.stringify(message));
    });
    this.socket.on('update', (message: string) => {
      this.handleUpdateMessage(message);
    });
  }

  protected handleUpdateMessage(message: any) {
    let responseMessage: ResponseMessage;
    try {
      responseMessage = JSON.parse(JSON.stringify(message));
    } catch (exception) {
      return;
    }

    this.result = JSON.stringify(responseMessage);
    this.saving = false;

    const { data }: any = responseMessage.body;

    if (!data) {
      return;
    }

    const { collection, method, result } = data;
    const collections: string[] = this.database.getCollectionNames();
    const doesCollectionExist: boolean = collections.includes(collection);

    if (
      method === 'application_operations_post' ||
      method === 'application_operations_put'
    ) {
      if (doesCollectionExist) {
        this.database[collection].upsert(result, () => {
          this.saving = false;
        });
      } else {
        this.database.addCollection(collection, () => {
          this.database[collection].upsert(result, () => {
            this.saving = false;
          });
        });
      }
    } else if (method === 'application_operations_get') {
      // nothing to do
    } else if (method === 'application_operations_delete') {
      if (doesCollectionExist) {
        this.database[collection].remove(result._id, () => {
          this.saving = false;
        });
      }
    }
  }

  protected onSendMessageButtonClicked() {
    if (this.socket?.disconnected) {
      return;
    }

    let message: any = {};
    let jsonData: any = {};
    let jsonUserPermissions: any[] = [];
    let jsonQuery: any = {};
    let fields: string[] = [];

    try {
      jsonData = JSON.parse(this.data);
    } catch {}
    try {
      jsonQuery = JSON.parse(this.query);
    } catch {}
    try {
      jsonQuery = JSON.parse(this.query);
    } catch {}
    try {
      if (this.fieldsString !== '') {
        fields = this.fieldsString.replace(/\s/g, '').split(',');
      }
    } catch {}

    if (this.method === 'application_operations_post') {
      message = {
        collection: this.collection,
        data: jsonData,
        userPermissions: jsonUserPermissions,
        method: this.method,
      };
    } else if (this.method === 'application_operations_get') {
      message = {
        collection: this.collection,
        query: jsonQuery,
        method: this.method,
        fields,
        includeFields: this.includeFields,
      };
    } else if (this.method === 'application_operations_put') {
      message = {
        collection: this.collection,
        data: jsonData,
        objectId: this.objectId,
        method: this.method,
      };
    } else if (this.method === 'application_operations_delete') {
      message = {
        collection: this.collection,
        objectId: this.objectId,
        method: this.method,
      };
    }

    this.socket.emit('message', message);
  }
}
</script>

<style scoped></style>
