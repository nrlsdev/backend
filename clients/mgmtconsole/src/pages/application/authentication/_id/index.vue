<template>
  <div v-if="application">
    <h1 class="system-large-title-font">{{ $t('StrAuthentication') }}</h1>
    <section class="application-section">
      <div>
        <h2 class="system-title-two-font">
          {{ $t('StrAuthenticationMethods') }}
        </h2>
      </div>
      <div class="application-general-info-container">
        <Collapse
          icon="email"
          :title="$t('StrEmailAndPassword')"
          statusIcon="checkmark"
        >
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="
              application.authentication.methods.emailAndPassword.activated
            "
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodEmailAndPasswordExplanation') }}
          </p>
        </Collapse>
        <Collapse icon="apple" :title="$t('StrApple')" statusIcon="checkmark">
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="application.authentication.methods.apple.activated"
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodAppleExplanation') }}
          </p>
          <label>{{ $t('StrServicesId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.apple.servicesId"
            :placeholder="$t('StrServicesId')"
          />
          <label>{{ $t('StrAppleTeamId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.apple.appleTeamId"
            :placeholder="$t('StrAppleTeamId')"
          />
          <label>{{ $t('StrKeyId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.apple.keyId"
            :placeholder="$t('StrKeyId')"
          />
          <label>{{ $t('StrPrivateKey') }}</label>
          <CustomInput
            class="block"
            type="textarea"
            v-model="application.authentication.methods.apple.privateKey"
            :placeholder="$t('StrPrivateKey')"
          />
        </Collapse>
        <Collapse icon="google" :title="$t('StrGoogle')" statusIcon="checkmark">
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="application.authentication.methods.google.activated"
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodGoogleExplanation') }}
          </p>
          <label>{{ $t('StrWebClientId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.google.webClientId"
            :placeholder="$t('StrWebClientId')"
          />
          <label>{{ $t('StrWebClientSecret') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.google.webClientSecret"
            :placeholder="$t('StrWebClientSecret')"
          />
        </Collapse>
        <Collapse
          icon="microsoft"
          :title="$t('StrMicrosoft')"
          statusIcon="checkmark"
        >
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="application.authentication.methods.microsoft.activated"
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodMicrosoftExplanation') }}
          </p>
          <label>{{ $t('StrApplicationId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.microsoft.applicationId"
            :placeholder="$t('StrApplicationId')"
          />
          <label>{{ $t('StrApplicationSecret') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="
              application.authentication.methods.microsoft.applicationSecret
            "
            :placeholder="$t('StrApplicationSecret')"
          />
        </Collapse>
        <Collapse
          icon="facebook"
          :title="$t('StrFacebook')"
          statusIcon="checkmark"
        >
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="application.authentication.methods.facebook.activated"
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodFacebookExplanation') }}
          </p>
          <label>{{ $t('StrAppId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.facebook.appId"
            :placeholder="$t('StrAppId')"
          />
          <label>{{ $t('StrApplicationSecret') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="
              application.authentication.methods.facebook.applicationSecret
            "
            :placeholder="$t('StrApplicationSecret')"
          />
        </Collapse>
        <Collapse
          icon="instagram"
          :title="$t('StrInstagram')"
          statusIcon="checkmark"
        >
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="application.authentication.methods.instagram.activated"
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodInstagramExplanation') }}
          </p>
          <label>{{ $t('StrAppId') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.instagram.appId"
            :placeholder="$t('StrAppId')"
          />
          <label>{{ $t('StrApplicationSecret') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="
              application.authentication.methods.instagram.applicationSecret
            "
            :placeholder="$t('StrApplicationSecret')"
          />
        </Collapse>
        <Collapse
          icon="twitter"
          :title="$t('StrTwitter')"
          statusIcon="checkmark"
        >
          <ToggleSwitch
            :text="$t('StrActivate')"
            v-model="application.authentication.methods.twitter.activated"
          />
          <p class="application-description">
            {{ $t('StrAuthenticationMethodTwitterExplanation') }}
          </p>
          <label>{{ $t('StrAPIKey') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.twitter.apiKey"
            :placeholder="$t('StrAPIKey')"
          />
          <label>{{ $t('StrAPISecret') }}</label>
          <CustomInput
            class="block"
            type="text"
            v-model="application.authentication.methods.twitter.apiSecret"
            :placeholder="$t('StrAPISecret')"
          />
        </Collapse>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import { ApplicationData } from '../../../../store/modules/application';

@Component
export default class ApplicationAuthenticationPage extends Vue {
  protected applicationId: string = '';

  protected originalApplication: ApplicationData | null = null;

  protected application: ApplicationData | null = null;

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    await this.loadApplication();
  }

  protected async loadApplication() {
    this.originalApplication = await getApplicationById(this.applicationId);

    if (this.originalApplication) {
      this.application = { ...this.originalApplication };
    }
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>
