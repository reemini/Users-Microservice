from django.contrib.auth.tokens import PasswordResetTokenGenerator

class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # This method now uses str instead of text_type (from six)
        return (str(user.pk) + str(timestamp) + str(user.is_active))

account_activation_token = TokenGenerator()
