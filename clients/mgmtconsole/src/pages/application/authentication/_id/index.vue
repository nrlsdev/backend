<template>
  <div>
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
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodEmailAndPasswordExplanation') }}
          </p>
        </Collapse>
        <Collapse icon="apple" :title="$t('StrApple')" statusIcon="checkmark">
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodAppleExplanation') }}
          </p>
          <label>{{ $t('StrServicesId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrServicesId')" />
          <hr class="collapse-separator" />
          <label>{{ $t('StrAppleTeamId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrAppleTeamId')" />
          <label>{{ $t('StrKeyId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrKeyId')" />
          <label>{{ $t('StrPrivateKey') }}</label>
          <CustomInput class="block" :placeholder="$t('StrPrivateKey')" />
        </Collapse>
        <Collapse icon="google" :title="$t('StrGoogle')" statusIcon="checkmark">
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodGoogleExplanation') }}
          </p>
          <label>{{ $t('StrWebClientId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrWebClientId')" />
          <label>{{ $t('StrWebClientSecret') }}</label>
          <CustomInput class="block" :placeholder="$t('StrWebClientSecret')" />
        </Collapse>
        <Collapse
          icon="microsoft"
          :title="$t('StrMicrosoft')"
          statusIcon="checkmark"
        >
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodMicrosoftExplanation') }}
          </p>
          <label>{{ $t('StrApplicationId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrApplicationId')" />
          <label>{{ $t('StrApplicationSecret') }}</label>
          <CustomInput
            class="block"
            :placeholder="$t('StrApplicationSecret')"
          />
        </Collapse>
        <Collapse
          icon="facebook"
          :title="$t('StrFacebook')"
          statusIcon="checkmark"
        >
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodFacebookExplanation') }}
          </p>
          <label>{{ $t('StrAppId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrAppId')" />
          <label>{{ $t('StrApplicationSecret') }}</label>
          <CustomInput
            class="block"
            :placeholder="$t('StrApplicationSecret')"
          />
        </Collapse>
        <Collapse
          icon="instagram"
          :title="$t('StrInstagram')"
          statusIcon="checkmark"
        >
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodInstagramExplanation') }}
          </p>
          <label>{{ $t('StrAppId') }}</label>
          <CustomInput class="block" :placeholder="$t('StrAppId')" />
          <label>{{ $t('StrApplicationSecret') }}</label>
          <CustomInput
            class="block"
            :placeholder="$t('StrApplicationSecret')"
          />
        </Collapse>
        <Collapse
          icon="twitter"
          :title="$t('StrTwitter')"
          statusIcon="checkmark"
        >
          <ToggleSwitch :text="$t('StrActivate')" />
          <p>
            {{ $t('StrAuthenticationMethodTwitterExplanation') }}
          </p>
          <label>{{ $t('StrAPIKey') }}</label>
          <CustomInput class="block" :placeholder="$t('StrAPIKey')" />
          <label>{{ $t('StrAPISecret') }}</label>
          <CustomInput class="block" :placeholder="$t('StrAPISecret')" />
        </Collapse>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationAuthenticationPage extends Vue {
  protected layout() {
    return 'application';
  }
}
</script>

<style scoped>
.collapse-separator {
  border-color: var(--collapse-separator-line-color);
}
</style>
<style src="~/assets/styles/pages/application.css" scoped></style>
