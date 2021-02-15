<template>
  <div v-if="application">
    <h1 class="system-large-title-font page-header">
      {{ $t('StrAuthentication') }}
    </h1>
    <section
      class="application-section"
      :class="
        $mq === 'sm' ? 'application-section-mobile' : 'application-section'
      "
    >
      <h2 class="system-title-two-font">
        {{ $t('StrAuthenticationMethods') }}
      </h2>
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsEmailAndPasswordChangeActions"
            :onSaveBtnClicked="
              onAuthenticationMethodsEmailAndPasswordSaveBtnClicked
            "
            :error="authenticationMethodsEmailAndPasswordChangeActionsError"
          />
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsAppleChangeActions"
            :onSaveBtnClicked="onAuthenticationMethodsAppleSaveBtnClicked"
            :error="authenticationMethodsAppleChangeActionsError"
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsGoogleChangeActions"
            :onSaveBtnClicked="onAuthenticationMethodsGoogleSaveBtnClicked"
            :error="authenticationMethodsGoogleChangeActionsError"
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsMicrosoftChangeActions"
            :onSaveBtnClicked="onAuthenticationMethodsMicrosoftSaveBtnClicked"
            :error="authenticationMethodsMicrosoftChangeActionsError"
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsFacebookChangeActions"
            :onSaveBtnClicked="onAuthenticationMethodsFacebookSaveBtnClicked"
            :error="authenticationMethodsFacebookChangeActionsError"
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsInstagramChangeActions"
            :onSaveBtnClicked="onAuthenticationMethodsInstagramSaveBtnClicked"
            :error="authenticationMethodsInstagramChangeActionsError"
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
          <ApplicationChangeActions
            v-model="ShowAuthenticationMethodsTwitterChangeActions"
            :onSaveBtnClicked="onAuthenticationMethodsTwitterSaveBtnClicked"
            :error="authenticationMethodsTwitterChangeActionsError"
          />
        </Collapse>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { copyObject, objectEquals } from '@backend/systeminterfaces';
import { Application } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import { updateAuthenticationMethod } from '../../../../api/application/authentication';

@Component
export default class ApplicationAuthenticationPage extends Vue {
  protected applicationId: string = '';

  protected originalApplication: Application | null = null;

  protected application: Application | null = null;

  // view state
  protected showAuthenticationMethodsEmailAndPasswordChangeActions: boolean = false;
  protected authenticationMethodsEmailAndPasswordChangeActionsError: string =
    '';

  protected showAuthenticationMethodsAppleChangeActions: boolean = false;
  protected authenticationMethodsAppleChangeActionsError: string = '';

  protected showAuthenticationMethodsGoogleChangeActions: boolean = false;
  protected authenticationMethodsGoogleChangeActionsError: string = '';

  protected showAuthenticationMethodsMicrosoftChangeActions: boolean = false;
  protected authenticationMethodsMicrosoftChangeActionsError: string = '';

  protected showAuthenticationMethodsFacebookChangeActions: boolean = false;
  protected authenticationMethodsFacebookChangeActionsError: string = '';

  protected showAuthenticationMethodsInstagramChangeActions: boolean = false;
  protected authenticationMethodsInstagramChangeActionsError: string = '';

  protected showAuthenticationMethodsTwitterChangeActions: boolean = false;
  protected authenticationMethodsTwitterChangeActionsError: string = '';

  protected get ShowAuthenticationMethodsEmailAndPasswordChangeActions() {
    return (
      this.showAuthenticationMethodsEmailAndPasswordChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.emailAndPassword,
        this.originalApplication?.authentication?.methods?.emailAndPassword,
      )
    );
  }

  protected get ShowAuthenticationMethodsAppleChangeActions() {
    return (
      this.showAuthenticationMethodsAppleChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.apple,
        this.originalApplication?.authentication?.methods?.apple,
      )
    );
  }

  protected get ShowAuthenticationMethodsGoogleChangeActions() {
    return (
      this.showAuthenticationMethodsGoogleChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.google,
        this.originalApplication?.authentication?.methods?.google,
      )
    );
  }

  protected get ShowAuthenticationMethodsMicrosoftChangeActions() {
    return (
      this.showAuthenticationMethodsMicrosoftChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.microsoft,
        this.originalApplication?.authentication?.methods?.microsoft,
      )
    );
  }

  protected get ShowAuthenticationMethodsFacebookChangeActions() {
    return (
      this.showAuthenticationMethodsFacebookChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.facebook,
        this.originalApplication?.authentication?.methods?.facebook,
      )
    );
  }

  protected get ShowAuthenticationMethodsInstagramChangeActions() {
    return (
      this.showAuthenticationMethodsInstagramChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.instagram,
        this.originalApplication?.authentication?.methods?.instagram,
      )
    );
  }

  protected get ShowAuthenticationMethodsTwitterChangeActions() {
    return (
      this.showAuthenticationMethodsAppleChangeActions ||
      !objectEquals(
        this.application?.authentication?.methods?.twitter,
        this.originalApplication?.authentication?.methods?.twitter,
      )
    );
  }

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
      this.application = copyObject(this.originalApplication);
    }

    this.showAuthenticationMethodsEmailAndPasswordChangeActions = false;
  }

  // AuthenticationMethods
  // Email and Password
  protected async onAuthenticationMethodsEmailAndPasswordSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'emailAndPassword',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsEmailAndPasswordChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }

  // Apple
  protected async onAuthenticationMethodsAppleSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'apple',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsAppleChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }

  // Google
  protected async onAuthenticationMethodsGoogleSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'google',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsGoogleChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }

  // Microsoft
  protected async onAuthenticationMethodsMicrosoftSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'microsoft',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsMicrosoftChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }

  // Facebook
  protected async onAuthenticationMethodsFacebookSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'facebook',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsFacebookChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }

  // Instagram
  protected async onAuthenticationMethodsInstagramSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'instagram',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsInstagramChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }

  // Twitter
  protected async onAuthenticationMethodsTwitterSaveBtnClicked() {
    const error = await updateAuthenticationMethod(
      'twitter',
      this.applicationId,
      this.application,
    );

    if (error) {
      this.authenticationMethodsTwitterChangeActionsError = error;
      return;
    }

    this.loadApplication();
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>
