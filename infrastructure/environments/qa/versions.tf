terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  cloud {
    organization = "ShiftInteractive"

    workspaces {
      name = "shift-giving-qa"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
