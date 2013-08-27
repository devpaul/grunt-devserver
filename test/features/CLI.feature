Feature: Command line usage
  As a user I want to be able to run grunt-devserver
  from the command-line using different command-line arguments
  and expect a server to be started using those options

  Background:
    Given I am using the command line

  Scenario: default behavior
    When I run devserver
    Then I expect a http server is started on port "8000"

  Scenario: port configuration
    When I run devserver with the configuration:
    """
      --port 8001
    """
    Then I expect a http server is started on port "8001"